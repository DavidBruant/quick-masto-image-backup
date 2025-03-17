# quick-masto-image-backup

A utility to quickly backup images and alt-text from a given Mastodon account

For now, this adventure is exploratory, the scope is vague (should it be expanded to other media? should it work on other things than Mastodon account? Which versions of Mastodon?)

## Usage

### Quickest path

[Install node.js](https://nodejs.org/en)

then run this command in command-line (replace `@davidbruant@eldritch.cafe` with the Mastodon account you want to download images+alt-texts from)

**Create token on Mastodon**

```sh
# cd to directory where you want to backup to
TOKEN={Token} npx https://github.com/DavidBruant/quick-masto-image-backup @davidbruant@eldritch.cafe
```

This creates:
- a `backup-<accountname>` directory in which there is:
  - an `images` subdirectory with all downloaded images
  - an `alt-texts.csv` file with alt-texts with columns:
    - `image_path` : path to image
    - `alt`: corresponding alt-text

