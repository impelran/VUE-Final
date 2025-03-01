export async function parseRssFeed(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        return extractData(xmlDoc);

    } catch (error) {
        console.error('Error fetching or parsing RSS feed:', error);
        throw error;
    }
}

function extractData(xmlDoc) {
    const items = xmlDoc.querySelectorAll('item');
    const newsItems = [];

    items.forEach(item => {
        const title = item.querySelector('title')?.textContent;
        const link = item.querySelector('link')?.textContent;
        const description = item.querySelector('description')?.textContent;
        const pubDate = item.querySelector('pubDate')?.textContent;
        let image = null;
        const enclosure = item.querySelector('enclosure[url]');
        const mediaContent = item.querySelector('media\\:content[url]');
        const mediaThumbnail = item.querySelector('media\\:thumbnail[url]');

        if (enclosure) {
            image = enclosure.getAttribute('url');
        } else if (mediaContent) {
            image = mediaContent.getAttribute('url');
        } else if (mediaThumbnail) {
            image = mediaThumbnail.getAttribute('url');
        }

        newsItems.push({
            title,
            link,
            description,
            pubDate,
            imageUrl: image
        });
    });
    return newsItems;
}