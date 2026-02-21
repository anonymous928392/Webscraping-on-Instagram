const username = "username"; 
let followers = [];
let followings = [];
let dontFollowMeBack = [];
let iDontFollowBack = [];
let mutualFollowers = [];

(async () => {
  try {
    console.log("Process started! Give it a couple of seconds");

    const userQueryRes = await fetch(`https://www.instagram.com/web/search/topsearch/?query=${username}`);
    const userQueryJson = await userQueryRes.json();
    const userId = userQueryJson.users
      .map(u => u.user)
      .filter(u => u.username === username)[0].pk;

    let after = null;
    let has_next = true;

    while (has_next) {
      const res = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
        encodeURIComponent(JSON.stringify({ id: userId, include_reel: true, fetch_mutual: true, first: 50, after }))
      ).then(res => res.json());
      has_next = res.data.user.edge_followed_by.page_info.has_next_page;
      after = res.data.user.edge_followed_by.page_info.end_cursor;
      followers = followers.concat(
        res.data.user.edge_followed_by.edges.map(({ node }) => ({ username: node.username, full_name: node.full_name }))
      );
    }

    after = null;
    has_next = true;

    while (has_next) {
      const res = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
        encodeURIComponent(JSON.stringify({ id: userId, include_reel: true, fetch_mutual: true, first: 50, after }))
      ).then(res => res.json());
      has_next = res.data.user.edge_follow.page_info.has_next_page;
      after = res.data.user.edge_follow.page_info.end_cursor;
      followings = followings.concat(
        res.data.user.edge_follow.edges.map(({ node }) => ({ username: node.username, full_name: node.full_name }))
      );
    }

    dontFollowMeBack = followings.filter(following => !followers.find(f => f.username === following.username));
    iDontFollowBack  = followers.filter(follower => !followings.find(f => f.username === follower.username));
    mutualFollowers  = followers.filter(follower =>  followings.find(f => f.username === follower.username));

    console.log({ followers });
    console.log({ followings });
    console.log({ dontFollowMeBack });
    console.log({ iDontFollowBack });
    console.log({ mutualFollowers });

    function downloadTXT(data, filename) {
      const content = data.map(u => `${u.username} | ${u.full_name}`).join("\n");
      const blob = new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }

    downloadTXT(followers,        "followers.txt");
    downloadTXT(followings,       "followings.txt");
    downloadTXT(dontFollowMeBack, "no_me_siguen.txt");
    downloadTXT(iDontFollowBack,  "no_les_sigo.txt");
    downloadTXT(mutualFollowers,  "mutuos.txt");

    console.log("✅ Process done! Check your downloads folder.");

  } catch (err) {
    console.log({ err });
  }
})();
