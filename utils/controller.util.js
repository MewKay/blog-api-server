const transformTextToPreview = function truncatePostsTextToShorterPreview(
  posts,
) {
  const PREVIEW_MAX_LENGTH = 301;

  const shortenedPosts = posts.map((post) => {
    let preview;
    const { text, ...postFields } = post;

    if (post.text.length <= PREVIEW_MAX_LENGTH) {
      preview = text;
    } else {
      preview = text.slice(0, PREVIEW_MAX_LENGTH).concat("...");
    }

    return {
      preview,
      ...postFields,
    };
  });

  return shortenedPosts;
};

module.exports = { transformTextToPreview };
