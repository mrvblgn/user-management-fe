import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { verifyToken } from "@/lib/jwt";
import { ServiceFactory } from "@/services";
import { UploadValidationError } from "@/services/user.service";

export const runtime = "nodejs";

const requiredColumns = ["firstName", "lastName", "email", "age", "password"];

export async function POST(request: NextRequest) {
	const token = request.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Yetkisiz İşlem" }, { status: 401 });
	}

	try {
		verifyToken(token);
	} catch {
		return NextResponse.json({ error: "Yetkisiz İşlem" }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file");

		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];

		if (!sheetName) {
			return NextResponse.json(
				{ error: "Excel sayfası bulunamadı" },
				{ status: 400 }
			);
		}

		const worksheet = workbook.Sheets[sheetName];
		const rows = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
			header: 1,
			defval: "",
		}) as Array<Array<string | number>>;

		if (rows.length < 2) {
			return NextResponse.json(
				{ error: "Veri satırı bulunamadı" },
				{ status: 400 }
			);
		}

		const headerRow = rows[0].map((cell) => String(cell).trim());
		const columnIndex = new Map<string, number>();
		headerRow.forEach((header, index) => columnIndex.set(header, index));

		const missingColumns = requiredColumns.filter(
			(column) => !columnIndex.has(column)
		);

		if (missingColumns.length > 0) {
			return NextResponse.json(
				{ error: `Eksik kolonlar: ${missingColumns.join(", ")}` },
				{ status: 400 }
			);
		}

		const parsedRows = rows.slice(1).flatMap((row, index) => {
			const isEmpty = row.every((cell) => String(cell).trim() === "");
			if (isEmpty) {
				return [];
			}

			return [
				{
					firstName: row[columnIndex.get("firstName") as number],
					lastName: row[columnIndex.get("lastName") as number],
					email: row[columnIndex.get("email") as number],
					age: row[columnIndex.get("age") as number],
					password: row[columnIndex.get("password") as number],
					rowNumber: index + 2,
				},
			];
		});

		if (parsedRows.length === 0) {
			return NextResponse.json(
				{ error: "Veri satırı bulunamadı" },
				{ status: 400 }
			);
		}

		const userService = ServiceFactory.createUserService();
		const insertedCount = await userService.uploadUsersFromExcel(parsedRows);

		return NextResponse.json(
			{ message: "Kullanıcılar aktarıldı", count: insertedCount },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof UploadValidationError) {
			return NextResponse.json(
				{ error: error.message, row: error.rowNumber },
				{ status: 400 }
			);
		}

		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası" },
			{ status: 500 }
		);
	}
}
