import asyncio
import sys
sys.path.append('src')
from server import create_bar_chart

async def main():
    result = await create_bar_chart(
        x_data=['Koramangala', 'Indiranagar', 'Whitefield'],
        y_data=[85000, 82000, 78000],
        name='Bangalore Areas'
    )
    print('=== OUTPUT ANALYSIS ===')
    print(f'Type: {type(result)}')
    print(f'Length: {len(result)} characters')
    print(f'Is HTML: {result.startswith("<html")}')
    print()
    print('=== FIRST 500 CHARACTERS ===')
    print(result[:500])
    
    # Save to file
    with open('sample_output.html', 'w') as f:
        f.write(result)
    print()
    print('Saved to sample_output.html')

asyncio.run(main())
