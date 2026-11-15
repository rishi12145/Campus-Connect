const fs = require('fs');
const path = require('path');

const exploreDir = path.join(__dirname, 'campus-connect', 'frontend', 'public', 'images', 'explore');
fs.mkdirSync(exploreDir, { recursive: true });

// Curated verified Wikipedia Commons / Unsplash images for Diu places
const placesImages = [
  {
    filename: 'diu-fort.jpg',
    url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'st-pauls-church.jpg',
    url: 'https://images.unsplash.com/photo-1548625361-195fe57e9309?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'naida-caves.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'pani-kotha.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'zampa-gateway.jpg',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'st-francis-church.jpg',
    url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'st-thomas-museum.jpg',
    url: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'ins-khukri.jpg',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'nagoa-beach.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'ghoghla-beach.jpg',
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'jalandhar-beach.jpg',
    url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'chakratirth-beach.jpg',
    url: 'https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'gomtimata-beach.jpg',
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'khukri-beach.jpg',
    url: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'fort-beach.jpg',
    url: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'sunset-point.jpg',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'gangeshwar-temple.jpg',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'fudam-sanctuary.jpg',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'dinosaur-park.jpg',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'shell-museum.jpg',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80'
  },
  {
    filename: 'campus-sky.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80'
  }
];

async function downloadImages() {
  for (const item of placesImages) {
    const dest = path.join(exploreDir, item.filename);
    try {
      console.log(`Downloading ${item.filename}...`);
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        console.log(`Saved ${item.filename} (${buffer.length} bytes)`);
      } else {
        console.warn(`Failed ${item.filename}: ${res.status}`);
      }
    } catch (e) {
      console.error(`Error ${item.filename}: ${e.message}`);
    }
  }
}

downloadImages();

