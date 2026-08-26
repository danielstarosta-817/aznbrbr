export default function LanguageBadge({ languages }) {
  if (!languages || languages.length === 0) return null;
  return (
    <span className="chip bg-badge/10 text-badge border border-badge/20">
      Reviews in {languages.join(", ")}
    </span>
  );
}
