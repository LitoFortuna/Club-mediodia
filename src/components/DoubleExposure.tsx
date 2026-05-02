import { cn } from "@/lib/utils";

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
}

export function DoubleExposure({ text, as = "h2", className }: Props) {
  const Tag = as;
  return (
    <Tag className={cn("eroded", className)}>
      <span className="double-expo" data-text={text}>
        {text}
      </span>
    </Tag>
  );
}
