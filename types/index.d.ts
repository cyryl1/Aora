
interface Creator {
    username: string;
    avatar: string;
}

interface Video {
    title: string;
    thumbnail: string;
    video: string;
    creator: Creator;
}

declare interface VideoCardProps {
    video: Video;
}

declare interface Post extends Video {
    $id: string;
}

interface TrendingItemProps {
  activeItem: string;
  item: Post;
}

interface SearchInputProps {
    initialQuery: string;
}

interface InfoBoxProps {
    title: string | number;
    subtitle: string;
    containerStyles: string;
    titleStyles: string
}
