# Webscraping-on-Instagram

## Code Functionality

This script is useful for retrieving the following from Instagram:
- **Followers**
- **Followings**
- **DontFollowYouBack**
- **YouDontFollowBack**
- **MutualFollowers**

It works for both **private** and **public** accounts. If the account is private and you're friends with the user, it will retrieve the data. If the account is public, it will work regardless of whether you're following the user.

## Usage

1. **Open Instagram in your browser and log in.**
2. Open the **Developer Tools** or **Element Inspector** in your browser. You can do this by right-clicking on the page and selecting **Inspect**, or pressing `Ctrl+Shift+I` (Windows) or `Cmd+Opt+I` (Mac).
3. Go to the **Console** tab.
4. Copy and paste the script `webscraping_instagram.js` into the **Console**.
5. Change the `username` variable in the first line of the script to the username you want to scrape:

   ```javascript
   const username = "desired_username";  // Replace with the target username
