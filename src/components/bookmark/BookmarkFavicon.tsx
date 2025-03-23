
interface BookmarkFaviconProps {
  url: string;
}

const BookmarkFavicon = ({ url }: BookmarkFaviconProps) => {
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <img
        src={getFaviconUrl(url)}
        alt=""
        className="w-5 h-5 rounded-sm object-contain"
        onError={(e) => {
          // Fallback if favicon doesn't load
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/64?text=🔖";
        }}
      />
    </div>
  );
};

export default BookmarkFavicon;
