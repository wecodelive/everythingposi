/**
 * Media Preload Configuration
 * Add links to the document head for early preloading of critical assets
 */

export const setupMediaPreload = () => {
    if (typeof document === 'undefined') return;

    const criticalAssets = [
        // Hero video
        { url: '/bg-vid.mp4', type: 'video/mp4', rel: 'preload', as: 'video' },
        { url: '/preBgVid.png', type: 'image/png', rel: 'preload', as: 'image' },

        // Category images
        { url: '/necklace.jpg', type: 'image/jpeg', rel: 'preload', as: 'image' },
        { url: '/bracelet.jpg', type: 'image/jpeg', rel: 'preload', as: 'image' },
        { url: '/earrings.jpg', type: 'image/jpeg', rel: 'preload', as: 'image' },
        { url: '/rings.jpg', type: 'image/jpeg', rel: 'preload', as: 'image' },

        // Prefetch product images (these will be needed but not immediately)
        { url: '/necklace.jpg', rel: 'prefetch', as: 'image' },
        { url: '/bracelet.jpg', rel: 'prefetch', as: 'image' },
    ];

    const head = document.head;

    criticalAssets.forEach(({ url, type, rel, as }) => {
        // Check if link already exists
        const existingLink = head.querySelector(`link[href="${url}"][rel="${rel}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = rel;
        link.href = url;

        if (as) {
            link.as = as;
        }

        if (type && rel === 'preload') {
            link.type = type;
        }

        // Add crossorigin for videos
        if (as === 'video') {
            link.crossOrigin = 'anonymous';
        }

        head.appendChild(link);
    });
};

/**
 * Helper to preload a set of images (e.g., product carousel images)
 * @param {string[]} imageUrls
 */
export const preloadProductImages = (imageUrls) => {
    if (typeof document === 'undefined') return;

    const head = document.head;

    imageUrls.forEach((url) => {
        const existingLink = head.querySelector(`link[href="${url}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = url;
        head.appendChild(link);
    });
};
