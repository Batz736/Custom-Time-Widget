# Customizable Date/Time Widget for Streaming & Personal Use

A highly customizable Date/Time widget designed for broadcasting software like OBS Studio, also usable as a standalone web page. Easily adjust fonts, colors, sizes, and time zones directly from a built-in settings panel, all accessible via a simple web link.

## 🚀 Get Your Widget Live!

This widget is designed for easy integration into your streaming setup without needing to download any files. Simply use the provided public browser link.

**Your Widget's Public Browser Link:**

`https://batz736.github.io/Custom-Time-Widget/widget.html`*(https://batz736.github.io/Custom-Time-Widget/widget.html)*

---

## ✨ Features

* **Real-time Date & Time Display:** Keeps time accurate and up-to-date.
* **Highly Customizable:**
    * **Font Selection:** Choose from a wide range of common system fonts and popular web fonts (e.g., Arial, Montserrat, Bayon, Showcard Gothic, Cooper, etc.).
    * **Font Size & Color:** Adjust text size and color to match your branding or preference.
    * **Widget Dimensions:** Set the exact width and height of the widget container.
    * **Background Color & Opacity:** Customize the widget's background color and its transparency level (from fully transparent to opaque).
    * **Time Zone Selection:** Pick any global time zone to display the time relevant to your stream or audience.
* **Unobtrusive Settings:** The settings button only appears on hover, keeping your widget clean and minimal during broadcasts.
* **Persistent Settings:** Your customizations are saved locally in your browser's cache (or OBS's browser source cache) using `localStorage`, so they persist even after closing and reopening.
* **Transparent Background:** Optimized for overlays in broadcast software, ensuring only your widget is visible.

---

## 💻 How to Add to OBS Studio (or other Broadcast Software)

Follow these steps to integrate the widget into your streaming setup:

1.  **Open OBS Studio.**
2.  In the "Sources" dock, click the `+` button to add a new source.
3.  Select **`Browser`**.
4.  Give your new source a descriptive name (e.g., "Stream Date/Time"). Click "OK".
5.  In the properties window that appears:
    * **Crucially:** Ensure the **"Local file"** checkbox is **UNCHECKED**.
    * In the **"URL"** field, paste the public browser link for your widget:
        `(https://batz736.github.io/Custom-Time-Widget/widget.html)`
    * Set the **Width** and **Height** of the Browser Source. A good starting point is `400` for Width and `150` for Height, but you can adjust this to fit your stream layout.
    * *(Optional but Recommended):* Check "Shutdown source when not active" and "Refresh browser when scene becomes active" for optimal performance.
    * Click "OK".

## 🛠️ Customize Your Widget

The widget features an integrated settings panel accessible directly from the Browser Source.

1.  In OBS Studio, right-click on your new "Stream Date/Time" (or whatever you named it) source in the "Sources" dock.
2.  Select **"Interact"**.
3.  A new window will open showing your widget. **Hover your mouse over the widget within this window** to make the "⚙️ Settings" button appear in the top-right corner.
4.  Click the "⚙️ Settings" button to open the customization panel.
5.  Adjust the various settings for font, size, colors, widget dimensions, background opacity, and time zone.
6.  Click **"Save Settings"** to apply your changes.
7.  Click **"Close"** to dismiss the settings panel.
8.  Close the "Interact" window. Your widget in OBS will update instantly with your new settings!

**To Reset to Defaults:**
In the settings panel, click the "Reset to Defaults" button. This will revert all settings to their initial state and clear your saved preferences.

---

## 🎨 Transparency

The widget is designed for seamless overlaying.
* The area *around* the widget is fully transparent by default.
* The widget's own background (the colored rectangle) has an adjustable opacity. To make the widget's background completely invisible (showing only the text), set the "Background Opacity" slider to `0` in the settings panel.

## ⚙️ How Settings Are Saved

Your custom settings are stored locally in your browser's `localStorage` (or OBS's internal browser cache for that specific source URL). This means your personalized settings will persist even if you close and reopen OBS or your browser.

## 🌐 Fonts

The widget utilizes a combination of common system fonts and popular Google Fonts (Montserrat, Bayon) to provide a wide range of aesthetic options, all loaded directly via the web link.

**Included Font Options:**

* Arial
* Arial Black
* Arial Bold
* Franklin Gothic
* Showcard Gothic
* Bayon (Web Font)
* Montserrat (Web Font)
* Montserrat Bold (Web Font)
* Bernard MT
* Cooper Black
* Onyx
* Verdana
* Tahoma
* Trebuchet MS
* Georgia
* Times New Roman
* Courier New
* Lucida Console
* Impact
* Comic Sans MS

---

## 💖 Contributing

Feel free to fork the repository where these files are hosted, make improvements, or suggest new features!

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
