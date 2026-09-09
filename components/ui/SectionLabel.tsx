type Props = {
  index: string;
  title: string;
};

export default function SectionLabel({ index, title }: Props) {
  return (
    <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] text-bone/40">
      <span className="text-solar">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-white/15" />
      <span>{title}</span>
    </div>
  );
}
