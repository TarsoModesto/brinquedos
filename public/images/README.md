# Imagens do projeto — Carretinha Mini Parke

Coloque aqui as fotos reais. As fotos são servidas diretamente em `/images/...`
(ex: `<img src="/images/hero/principal.jpg" />`).

## Estrutura

```
public/images/
├── hero/         → 1 foto principal usada no topo da home (alta qualidade)
├── gallery/      → fotos da galeria (mínimo 6, ideal 8–12)
├── logo/         → variações do logo (claro/escuro/quadrado)
├── og/           → imagem para compartilhamento em redes sociais (1200×630)
└── partners/     → logos de parceiros, marcas, certificações (opcional)
```

## Convenção de nomes

- **Tudo minúsculo, sem espaços, sem acentos.** Use `-` para separar palavras.
  - ✅ `festa-aniversario-pedro.jpg`
  - ❌ `Festa Aniversário do Pedro.JPG`
- Numere sequencialmente quando fizer sentido: `gallery-01.jpg`, `gallery-02.jpg`…

## Recomendações por pasta

### `hero/principal.jpg`
- 1600×1200 (4:3) ou 1600×2000 (4:5)
- Foco na carretinha em uso, com crianças se divertindo
- JPG comprimido (alvo: < 400 KB)

### `gallery/`
- 6 a 12 fotos, todas em **proporção parecida** (4:3 funciona bem)
- 1200×900 é suficiente
- Mistura: festas diferentes, ângulos variados, momentos de alegria

### `logo/`
- `logo.svg` — preferencial (vetor, escala em qualquer tamanho)
- `logo.png` — fallback, 512×512 com fundo transparente
- `logo-branco.png` — versão pra fundos escuros (opcional)
- `favicon.svg` ou `favicon.png` — 64×64

### `og/og-image.jpg`
- **Exatamente 1200×630** (padrão Open Graph)
- Imagem que vai aparecer quando alguém compartilhar o link no WhatsApp / Instagram / Facebook
- Deve conter: foto da carretinha + nome "Carretinha Mini Parke" + tagline curta

## Otimização

Antes de subir:
1. Reduza para a resolução recomendada (não use 4000×3000 do celular).
2. Comprima com TinyPNG, Squoosh ou similar — alvo: 200–500 KB por foto.
3. Para hero, considere também uma versão WebP (`principal.webp`) para navegadores modernos.

## Onde cada imagem é usada

| Arquivo | Componente | Onde aparece |
|---|---|---|
| `hero/principal.jpg` | `HeroSection` | Topo da home |
| `gallery/gallery-*.jpg` | `GalleryPage`, `GalleryPreviewSection` | Página de galeria + preview na home |
| `logo/logo.svg` | `Header`, `AdminLayout`, `Footer` | Cabeçalho do site e admin |
| `og/og-image.jpg` | `index.html` (meta og:image) | Compartilhamentos em redes |
| `partners/*` | (futuro) | Seção de parceiros, se vier a existir |

Depois que você popular a pasta, me avise os arquivos colocados que eu plugo no código no lugar das URLs do Unsplash/picsum.
