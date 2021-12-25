export const getCommonVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    try {
        const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
        
        const response = await fetch(`${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`)
        const videoData = await response.json();
    
        if(videoData?.error) {
            console.error("Youtube API error", videoData.error);
            return [];
        }

        return videoData.items.map(item => {
            const id = item.id?.videoId || item.id;
            return {
                id: id,
                imgUrl: item.snippet.thumbnails.high.url,
                title: item.snippet.title
            }
        });
    }catch(err) {
        console.error("Something went wrong fetching videos", err);
        return [];
    }
}

export const getVideos = async (searchQuery) => {
    const URL = `search?part=snippet&q=${searchQuery}`;
    return getCommonVideos(URL);
} 

export const getPopularVideos = (regionCode) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=${regionCode}`;
    return getCommonVideos(URL);
}