import { LoadingIndicator } from "@alga-psa/ui-kit";

export const Loader = () => {
    return <div className="flex flex-col items-center justify-center py-3 px-6">
        {/* <span className="text-sm text-text-700 animate-pulse">Loading...</span> */}
        <LoadingIndicator size="xs" text="Loading..." />
    </div>
};

export const PageLoader = () =>
(
    <div className="flex items-center justify-center w-screen h-screen">
        <LoadingIndicator size="lg" text="Loading..." />
    </div>
);