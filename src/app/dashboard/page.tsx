import DashboardView from "@/components/dashboard/DashboardView";
import { ServiceFactory } from "@/services";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; pageSize?: string; age?: string }>;
}) {
	const params = await searchParams;
	const page = Math.max(1, Number(params.page ?? 1) || 1);
	const pageSize = Math.min(50, Math.max(1, Number(params.pageSize ?? 10) || 10));
	const ageValue = params.age ? Number(params.age) : undefined;
	const age = Number.isInteger(ageValue) && (ageValue as number) > 0 ? ageValue : undefined;

	const userService = ServiceFactory.createUserService();
	const result = await userService.listUsers({ page, pageSize, age });

	return (
		<DashboardView
			users={result.data}
			page={result.page}
			pageSize={result.pageSize}
			total={result.total}
			totalPages={result.totalPages}
			age={result.age}
		/>
	);
}
