document.addEventListener('DOMContentLoaded', () => {
    const dateTimeWidget = document.getElementById('date-time-widget');
    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    const settingsButton = document.getElementById('settings-button');
    const settingsOverlay = document.getElementById('settings-overlay');
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

    // REMOVED: shareableLinkDisplay and copyLinkButton variables

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

    let currentSettings = { ...defaultSettings };

    // --- Helper Functions ---

    function populateTimezones() {
        const timezones = Intl.supportedValuesOf('timeZone');
        timezones.sort((a, b) => a.localeCompare(b));

        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localOption = document.createElement('option');
        localOption.value = localTimezone;
        localOption.textContent = `Local Time (${localTimezone})`;
        timezoneSelect.appendChild(localOption);

        timezones.forEach(zone => {
            if (zone === localTimezone) return;
            const option = document.createElement('option');
            option.value = zone;
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
                option.textContent = zone;
            }
            timezoneSelect.appendChild(option);
        });
    }

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

        // Set values in settings panel inputs (for UI consistency)
        fontFamilySelect.value = settings.fontFamily;
        fontSizeInput.value = settings.fontSize;
        textColorInput.value = settings.textColor;
        widgetWidthInput.value = settings.widgetWidth;
        widgetHeightInput.value = settings.widgetHeight;
        bgColorInput.value = settings.bgColor;
        bgOpacityInput.value = settings.bgOpacity;

        // Ensure timezone setting is valid for the select element
        if (Array.from(timezoneSelect.options).some(option => option.value === settings.timeZone)) {
            timezoneSelect.value = settings.timeZone;
        } else {
            timezoneSelect.value = Intl.DateTimeFormat().resolvedOptions().timeZone; // Fallback to local
            settings.timeZone = timezoneSelect.value; // Update settings object to reflect actual applied value
        }
    }

    // Convert settings object to URL query string
    function settingsToQueryString(settings) {
        const params = new URLSearchParams();
        for (const key in settings) {
            params.append(key, encodeURIComponent(settings[key]));
        }
        return params.toString();
    }

    // Convert URL query string to settings object
    function queryStringToSettings(queryString) {
        const params = new URLSearchParams(queryString);
        const settings = {};
        for (const [key, value] of params.entries()) {
            settings[key] = decodeURIComponent(value);
            if (key === 'fontSize' || key === 'widgetWidth' || key === 'widgetHeight') {
                settings[key] = parseInt(settings[key], 10);
            } else if (key === 'bgOpacity') {
                settings[key] = parseFloat(settings[key]);
            }
        }
        return settings;
    }

    // Get current URL and append/replace query string
    function updateUrlWithSettings(settings) {
        const currentUrl = new URL(window.location.href);
        const queryString = settingsToQueryString(settings);
        currentUrl.search = queryString;
        return currentUrl.toString();
    }

    // Modified: Function to load settings (prioritizes URL, then localStorage, then defaults)
    function loadSettings() {
        let loadedSettings = {};
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.toString()) { // Check if URL has any parameters
            loadedSettings = queryStringToSettings(urlParams.toString());
            // If URL parameters are present, prioritize them and clear localStorage
            localStorage.removeItem('dateTimeWidgetSettings');
        } else {
            const savedSettings = localStorage.getItem('dateTimeWidgetSettings');
            if (savedSettings) {
                try {
                    loadedSettings = JSON.parse(savedSettings);
                } catch (e) {
                    console.error("Error parsing saved settings from localStorage, loading defaults.", e);
                    loadedSettings = {};
                }
            }
        }

        currentSettings = { ...defaultSettings, ...loadedSettings };
        applySettings(currentSettings);
        // REMOVED: shareableLinkDisplay.value update here
    }

    // Modified: Function to save settings to localStorage AND update URL
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

        // Save to localStorage (as a fallback/initial state if URL is cleared manually)
        localStorage.setItem('dateTimeWidgetSettings', JSON.stringify(currentSettings));

        // Update the URL to include current settings
        const newUrl = updateUrlWithSettings(currentSettings);
        // history.pushState updates the URL bar without reloading the page.
        // It only works on URLs with a valid origin (not file://).
        history.pushState(currentSettings, '', newUrl);

        // REMOVED: shareableLinkDisplay.value update here
        applySettings(currentSettings); // Re-apply to ensure immediate visual update
    }

    // Modified: Function to reset settings to default
    function resetToDefaults() {
        if (confirm("Are you sure you want to reset all settings to their default values?")) {
            currentSettings = { ...defaultSettings };
            localStorage.removeItem('dateTimeWidgetSettings'); // Clear saved settings

            // Update URL to remove all parameters, effectively resetting via URL
            const cleanUrl = window.location.origin + window.location.pathname;
            history.pushState(defaultSettings, '', cleanUrl);

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
            // REMOVED: shareableLinkDisplay.value update here
        }
    }

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
            hour12: true,
            timeZone: currentSettings.timeZone,
        };

        const dateString = now.toLocaleDateString(undefined, optionsDate);
        const timeString = now.toLocaleTimeString(undefined, optionsTime);

        dateDisplay.textContent = dateString;
        timeDisplay.textContent = timeString;
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // --- Event Listeners ---

    settingsButton?.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default <a> tag navigation
        applySettings(currentSettings); // Load current settings into panel fields
        // REMOVED: shareableLinkDisplay.value update here
        settingsOverlay.classList.remove('hidden');
    });

    closeSettingsButton?.addEventListener('click', () => {
        settingsOverlay.classList.add('hidden');
    });

    saveSettingsButton?.addEventListener('click', () => {
        saveSettings();
        settingsOverlay.classList.add('hidden');
    });

    resetSettingsButton?.addEventListener('click', resetToDefaults);

    // REMOVED: copyLinkButton event listener

    // --- Initialization ---

    populateTimezones();
    loadSettings(); // Load and apply settings from URL or localStorage on start
    updateDateTime(); // Initial display

    // Update time every second
    setInterval(updateDateTime, 1000);
});
