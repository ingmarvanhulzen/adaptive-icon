## Adaptive android icon generator

This is a small project I have made to generate android adaptive and fallback icons for android apps. It request a back and foreground svg with a size of 108 to 108. Currentily it only supports paths. And background colors on the base element.

### Usage

```bash
yarn
yarn start
```

## Output

```
static/res/drawable/ic_launcher_background.xml
static/res/drawable/ic_launcher_foreground.xml
static/res/mimpap-anydpi-26/ic_launcher_round.xml
static/res/mimpap-anydpi-26/ic_launcher.xml
static/res/mimpap-hdpi/ic_launcher_round.png
static/res/mimpap-hdpi/ic_launcher.png
static/res/mimpap-ldpi/ic_launcher_round.png
static/res/mimpap-ldpi/ic_launcher.png
static/res/mimpap-mdpi/ic_launcher_round.png
static/res/mimpap-mdpi/ic_launcher.png
static/res/mimpap-xhdpi/ic_launcher_round.png
static/res/mimpap-xhdpi/ic_launcher.png
static/res/mimpap-xxhdpi/ic_launcher_round.png
static/res/mimpap-xxhdpi/ic_launcher.png
static/res/mimpap-xxxhdpi/ic_launcher_round.png
static/res/mimpap-xxxhdpi/ic_launcher.png
static/ic_launcher-web.png
```
