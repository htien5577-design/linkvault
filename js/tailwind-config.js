tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
                dark: {
                    900: '#0B0F19', // Nền chính cực đậm
                    800: '#151B2B', // Nền card
                    700: '#1E293B', // Viền
                },
                accent: {
                    DEFAULT: '#06B6D4', // Cyan 500
                    hover: '#0891B2',   // Cyan 600
                }
            }
        }
    }
}
