import { Spinner } from "@alga-psa/ui-kit";

export const Loader = () => {
    return <div className="flex flex-col items-center justify-center py-3 px-6">
        <Spinner size="xs" />
    </div>
};

export const PageLoader = () =>
(
    <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col gap-2">
            <Spinner size="lg" />
            <span className="text-text-600">Loading...</span>
        </div>
    </div>
);