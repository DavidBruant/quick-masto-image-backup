# quick-masto-image-backup

A utility to quickly backup images and alt-text from a given Mastodon account

For now, this adventure is exploratory, the scope is vague (should it be expanded to other media? should it work on other things than Mastodon account? Which versions of Mastodon?)

## Usage

As an example, let's say you want to backup images and alt-texts from your account `kcrenshaw` from the instance `intersectional.social`

1) [Install node.js](https://nodejs.org/en)

2) **Create token on Mastodon**

In your parameters in the `intersectional.social`, go to `Setting` => `Applications` (or `Development`) => Click on `new App`

Then create "an app" (give any name, it doesn't matter)
For "scopes", check `read`, `read:accounts` and `read:statuses`

This should lead you to a screen with various things, one of them being the "access token". Copy-paste this somewhere safe (not the `secret`, nor the `application id`, you won't need those)

then run the following command in command-line 
(
  replace `{Token}` with your access token and
  replace `@kcrenshaw@intersectional.social` with the Mastodon account you want to download images+alt-texts from
)

```sh
# cd to directory where you want to backup to
TOKEN={Token} npx https://github.com/DavidBruant/quick-masto-image-backup @kcrenshaw@intersectional.social
```

This creates:
- a `backup-<accountname>` directory in which there is:
  - an `images` subdirectory with all downloaded images
  - an `alt-texts.csv` file with alt-texts with columns:
    - `image_path` : path to image
    - `alt`: corresponding alt-text

If everything goes well, the output should look like this after a couple of minutes:

```sh
Account davidbruant found on instance eldritch.cafe (id: 110907)
10 downloaded images and alt-texts so far...
20 downloaded images and alt-texts so far...
30 downloaded images and alt-texts so far...
40 downloaded images and alt-texts so far...
50 downloaded images and alt-texts so far...
🎉 All done ! Downloaded 53 images and alt-texts
```

## Licence

[Creative Commons Zero 1.0](https://creativecommons.org/public-domain/cc0/)