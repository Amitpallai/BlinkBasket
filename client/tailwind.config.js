export default {
  theme: {
    extend: {
      animation: {
        'fadeUp': 'fadeUp 0.7s ease both',
        'scaleIn': 'scaleIn 1.1s ease both',
        'float': 'float 4s ease-in-out infinite',
        'ticker': 'ticker 28s linear infinite',
        'slideRight': 'slideRight 0.7s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    }
  }
}