import { P as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getPublicProfile } from "./hirewise.functions-BpXK-sUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-BAYWuQoQ.js
var $$splitComponentImporter = () => import("./u._username-tX3AGZhN.mjs");
var $$splitErrorComponentImporter = () => import("./u._username-DRB0TH3-.mjs");
var $$splitNotFoundComponentImporter = () => import("./u._username-DNsWgB_a.mjs");
var Route = createFileRoute("/u/$username")({
	loader: async ({ params }) => {
		const r = await getPublicProfile({ data: { username: params.username } });
		if (!r) throw notFound();
		return r;
	},
	head: ({ loaderData, params }) => {
		const name = loaderData?.profile?.display_name || params.username;
		return { meta: [
			{ title: `${name} on HireWise — Interview Readiness` },
			{
				name: "description",
				content: `${name}'s interview readiness on HireWise: streak, questions solved, mock interview average, and readiness score.`
			},
			{
				property: "og:title",
				content: `${name} on HireWise`
			},
			{
				property: "og:description",
				content: `Interview readiness score ${loaderData?.readiness ?? 0}. Streak ${loaderData?.streak?.current_streak ?? 0} days.`
			}
		] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
