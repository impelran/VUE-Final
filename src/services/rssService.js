export async function parseRssFeed(url) {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    try {
        const response = await fetch(CORS_PROXY + url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const items = xmlDoc.querySelectorAll("item");
        const newsItems = [];

        items.forEach(item => {
            const title = item.querySelector("title")?.textContent;
            const link = item.querySelector("link")?.textContent;
            let description = item.querySelector("description")?.textContent;
            let imageUrl = null

            if(description){
                const doc = new DOMParser().parseFromString(description, "text/html");
                const img = doc.querySelector('img');
                if(img){
                    imageUrl = img.getAttribute('src')  
                    img.remove();
                    description = doc.body.innerHTML
                }
            }

            if(!imageUrl){
                const enclosure = item.querySelector("enclosure");
                if (enclosure) {
                    imageUrl = enclosure.getAttribute('url')
                }
            }

            newsItems.push({
                title,
                link,
                description,
                imageUrl
            });
        });

        return newsItems;
    } catch (error) {
        console.error("Error parsing RSS feed:", error);
        throw error;
    }
}