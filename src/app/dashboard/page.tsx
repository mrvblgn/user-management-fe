import DashboardView from "@/components/dashboard/DashboardView";
import { ServiceFactory } from "@/services";

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: { page?: string; pageSize?: string; age?: string };
}) {
	const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
	const pageSize = Math.min(50, Math.max(1, Number(searchParams.pageSize ?? 10) || 10));
	const ageValue = searchParams.age ? Number(searchParams.age) : undefined;
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
