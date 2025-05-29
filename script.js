document.addEventListener('DOMContentLoaded', () => {
    const dateTimeWidget = document.getElementById('date-time-widget');
    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    const settingsButton = document.getElementById('settings-button');
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsButton = document.getElementById('close-settings');
    const saveSettingsButton = document.getElementById('save-settings');
    const resetSettingsButton = document.getElementById('reset-settings');

    // Settings inputs
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');
    const textColorInput = document.getElementById('text-color');
    const widgetWidthInput = document.getElementById('widget-width');
    const widgetHeightInput = document.getElementById('widget-height');
    const bgColorInput = document.getElementById('bg-color');
    const bgOpacityInput = document.getElementById('bg-opacity');
    const timezoneSelect = document.getElementById('timezone-select');

    // Default settings
    const defaultSettings = {
        fontFamily: 'Arial, sans-serif',
        fontSize: 48, // px
        textColor: '#FFFFFF',
        widgetWidth: 400, // px
        widgetHeight: 150, // px
        bgColor: '#000000',
        bgOpacity: 0.7,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's default
    };

    let currentSettings = { ...defaultSettings }; // Start with defaults

    // Function to populate time zones
    function populateTimezones() {
        const timezones = Intl.supportedValuesOf('timeZone');
        // Sort timezones for easier navigation
        timezones.sort((a, b) => a.localeCompare(b));

        timezones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            // Display a more readable format if possible (e.g., 'America/New_York' -> 'New York (America)')
            try {
                const now = new Date();
                const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
                    timeZone: zone,
                    timeZoneName: 'longOffset',
                });
                const parts = dateTimeFormat.formatToParts(now);
                const timeZoneNamePart = parts.find(p => p.type === 'timeZoneName');
                option.textContent = `${zone} (${timeZoneNamePart ? timeZoneNamePart.value : ''})`;
            } catch (e) {
                // Fallback if parsing fails for some rare zones
                option.textContent = zone;
            }
            timezoneSelect.appendChild(option);
        });
    }

    // Function to apply settings to the widget
    function applySettings(settings) {
        // Apply text styles
        dateDisplay.style.fontFamily = settings.fontFamily;
        timeDisplay.style.fontFamily = settings.fontFamily;
        dateDisplay.style.fontSize = `${settings.fontSize}px`;
        timeDisplay.style.fontSize = `${settings.fontSize}px`;
        dateDisplay.style.color = settings.textColor;
        timeDisplay.style.color = settings.textColor;

        // Apply widget size and background
        dateTimeWidget.style.width = `${settings.widgetWidth}px`;
        dateTimeWidget.style.height = `${settings.widgetHeight}px`;
        const rgb = hexToRgb(settings.bgColor);
        if (rgb) {
            dateTimeWidget.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${settings.bgOpacity})`;
        }

        // Set values in settings panel
        fontFamilySelect.value = settings.fontFamily;
        fontSizeInput.value = settings.fontSize;
        textColorInput.value = settings.textColor;
        widgetWidthInput.value = settings.widgetWidth;
        widgetHeightInput.value = settings.widgetHeight;
        bgColorInput.value = settings.bgColor;
        bgOpacityInput.value = settings.bgOpacity;
        timezoneSelect.value = settings.timeZone; // Make sure this matches an option value
    }

    // Function to load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('dateTimeWidgetSettings');
        if (savedSettings) {
            try {
                currentSettings = JSON.parse(savedSettings);
                // Ensure all default keys exist if new settings are added later
                currentSettings = { ...defaultSettings, ...currentSettings };
            } catch (e) {
                console.error("Error parsing saved settings, loading defaults.", e);
                currentSettings = { ...defaultSettings };
            }
        }
        applySettings(currentSettings);
    }

    // Function to save settings to localStorage
    function saveSettings() {
        currentSettings = {
            fontFamily: fontFamilySelect.value,
            fontSize: parseInt(fontSizeInput.value, 10),
            textColor: textColorInput.value,
            widgetWidth: parseInt(widgetWidthInput.value, 10),
            widgetHeight: parseInt(widgetHeightInput.value, 10),
            bgColor: bgColorInput.value,
            bgOpacity: parseFloat(bgOpacityInput.value),
            timeZone: timezoneSelect.value,
        };
        localStorage.setItem('dateTimeWidgetSettings', JSON.stringify(currentSettings));
        applySettings(currentSettings); // Re-apply to ensure immediate visual update
    }

    // Function to reset settings to default
    function resetToDefaults() {
        currentSettings = { ...defaultSettings };
        localStorage.removeItem('dateTimeWidgetSettings'); // Clear saved settings
        applySettings(currentSettings);
        // Also update the UI elements to reflect defaults
        fontFamilySelect.value = defaultSettings.fontFamily;
        fontSizeInput.value = defaultSettings.fontSize;
        textColorInput.value = defaultSettings.textColor;
        widgetWidthInput.value = defaultSettings.widgetWidth;
        widgetHeightInput.value = defaultSettings.widgetHeight;
        bgColorInput.value = defaultSettings.bgColor;
        bgOpacityInput.value = defaultSettings.bgOpacity;
        timezoneSelect.value = defaultSettings.timeZone;
    }

    // Function to update the date and time display
    function updateDateTime() {
        const now = new Date();
        const optionsDate = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: currentSettings.timeZone,
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // You can make this configurable too
            timeZone: currentSettings.timeZone,
        };

        // Format according to selected time zone
        const dateString = now.toLocaleDateString(undefined, optionsDate);
        const timeString = now.toLocaleTimeString(undefined, optionsTime);

        dateDisplay.textContent = dateString;
        timeDisplay.textContent = timeString;
    }

    // Helper to convert hex to RGB for rgba background
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Event Listeners
    settingsButton.addEventListener('click', () => {
        settingsOverlay.classList.remove('hidden');
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsOverlay.classList.add('hidden');
        loadSettings(); // Reload settings to discard unsaved changes
    });

    saveSettingsButton.addEventListener('click', () => {
        saveSettings();
        settingsOverlay.classList.add('hidden');
    });

    resetSettingsButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all settings to their default values?")) {
            resetToDefaults();
            // No need to close, let user see defaults are applied to inputs
        }
    });

    // Initialize
    populateTimezones();
    loadSettings(); // Load and apply saved settings on start
    updateDateTime(); // Initial display

    // Update time every second
    setInterval(updateDateTime, 1000);

    // Optional: Hide settings button if in OBS (or if you want to make it always hidden)
    // You'd typically set this in OBS CSS or use a query parameter in the URL.
    // For OBS, you can right-click the browser source -> Interact, to open settings.
    // If you want to hide the button for the 'live' widget, you can add this:
    // const urlParams = new URLSearchParams(window.location.search);
    // if (urlParams.get('mode') === 'widget') { // e.g., if you load with widget.html?mode=widget
    //     settingsButton.style.display = 'none';
    // }
});