interface TagProps {
  label: string
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-raised text-text-secondary border border-subtle">
      {label}
    </span>
  )
}
