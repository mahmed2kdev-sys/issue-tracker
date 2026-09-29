import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingNewIssuePage() {
  return (
    <div className="max-w-xl space-y-3">
      <Skeleton height="2.25rem" />
      <Skeleton height={300} />
      <Skeleton width="10rem" height="2.5rem" />
    </div>
  );
}
