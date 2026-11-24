# Health Bingo

Fem små hälsosamma handlingar om dagen, en från varje kategori: Kropp, Sinne, Relationer, Ute och Glädje. Översta raden på brickan är dagens bingo. När alla fem är gjorda blir det bingo.

Appen är en webbapp gjord för mobilen. Den installeras på iPhone via Safari, utan App Store. Allt sparas i webbläsaren på just den telefonen. Det finns ingen inloggning och ingen serverdatabas.

## Kör lokalt

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000). Bygg en produktionsversion med `npm run build` och starta den med `npm start`.

## Publicera på Vercel

Repot är ett vanligt Next.js-projekt (App Router). Vercel känner igen det utan extra inställningar.

1. Logga in på [vercel.com](https://vercel.com).
2. Välj **Add New… → Project**.
3. Importera GitHub-repot `Happyman67/health-bingo`.
4. Låt **Framework Preset** stå på Next.js. Inga miljövariabler behövs.
5. Tryck **Deploy**.

När `main` uppdateras publiceras produktion. Varje gren får en egen förhandsvisning. Appen behöver ingen databas, så både förhandsvisning och produktion fungerar direkt.

## Lägg till på hemskärmen (iPhone)

Installationen görs i **Safari**. Andra webbläsare på iPhone kan inte lägga till en riktig hemskärmsapp.

1. Öppna den publicerade adressen i Safari.
2. Tryck på **Dela** (fyrkanten med pilen).
3. Scrolla och välj **Lägg till på hemskärmen**.
4. Behåll namnet **Health Bingo** och tryck **Lägg till**.

Ikonen hamnar bland de andra apparna. Den öppnas utan Safaris adressfält, i ett eget fönster. Efter ett vanligt besök med nätverk kan brickan även öppnas offline: sidan och ikonerna cachas, och dina avbockningar ligger redan på telefonen.

## Så funkar brickan

Varje dag dras fem förslag, ett per kategori. Dragningen är densamma hela dagen på samma datum. Översta raden är dagens fem och går att bocka av, antingen i rutan eller i listan under. De andra rutorna visar hur många gånger den handlingen är gjord i år.

**Byt** byter ut ett av dagens förslag mot ett annat i samma kategori. Det går att byta en sak per dag.

När alla fem är klara visas **BINGO – Du klarade dagens fem.**

Årsvyn räknar mot **1 825** (fem handlingar × 365 dagar), visar en värmekarta för alla 25 handlingar och en kedja. En vilodag per vecka bryter inte kedjan. Veckan räknas måndag till söndag.

## Börja om och demoläge

**Meny** ligger uppe till höger.

**Börja om** frågar först. Svarar du ja tas alla sparade dagar bort från telefonen, även demoläget, och brickan är tom igen.

**Demoläge** är till för att visa appen. Där kan du gå till föregående eller nästa låtsasdag, fylla året med exempel och klara dagens fem direkt. Riktiga dagar rörs inte förrän du börjar om. Stäng av demoläget för att komma tillbaka till den vanliga dagen.

## Data

Historiken sparas i `localStorage` under nyckeln `health-bingo:v1`. Den följer inte med till en annan telefon och försvinner om du rensar webbplatsdata för sidan, eller om du väljer **Börja om** i menyn.
