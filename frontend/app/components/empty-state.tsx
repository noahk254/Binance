import { colors } from "./theme";
import { Icon, IconName } from "./icons";

export function EmptyState({
  icon,
  message,
  sub,
}: {
  icon: IconName;
  message: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center py-16">
      <Icon name={icon} size={64} color={colors.dim} strokeWidth={1} />
      <p className="mt-4 text-[14px] text-muted">{message}</p>
      {sub ? <p className="mt-1 text-[13px] text-dim">{sub}</p> : null}
    </div>
  );
}