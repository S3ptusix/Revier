export const renderMessageWithLinks = (text) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

        if (!match) {
            return <span key={index}>{part}</span>;
        }

        const [, label, url] = match;

        return (
            <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
            >
                {label}
            </a>
        );
    });
};
