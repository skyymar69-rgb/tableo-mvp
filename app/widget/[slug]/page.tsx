import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function WidgetPage({ params }: { params: { slug: string } }) {
  // Type explicite : Prisma renvoie un type complexe (Restaurant + relations) ou null,
  // pas juste null comme l'inférence le pensait.
  let restaurant: Awaited<ReturnType<typeof prisma.restaurant.findUnique>> | any = null;
  try {
    restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
      include: {
        menus: {
          where: { isPublished: true },
          include: {
            categories: {
              where: { isVisible: true },
              orderBy: { order: "asc" },
              include: { dishes: { where: { isAvailable: true }, orderBy: { order: "asc" }, take: 3 } },
              take: 3,
            },
          },
          take: 1,
        },
      },
    });
  } catch {}

  if (!restaurant) notFound();

  const menu = restaurant.menus[0];

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{restaurant.name} — Menu</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, sans-serif; background: #0E1320; color: #fff; padding: 16px; }
          .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
          .logo { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #F89544, #E879A0); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; }
          .restaurant-name { font-weight: 700; font-size: 16px; }
          .cta { font-size: 10px; color: rgba(255,255,255,0.5); }
          .category { margin-bottom: 16px; }
          .category-name { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #F89544; margin-bottom: 8px; }
          .dish { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 6px; }
          .dish-name { font-size: 13px; font-weight: 500; }
          .dish-price { font-size: 13px; font-weight: 700; color: #F89544; }
          .open-btn { display: block; width: 100%; padding: 12px; background: linear-gradient(135deg, #F89544, #E879A0); border: none; border-radius: 12px; color: #fff; font-weight: 600; font-size: 13px; text-align: center; text-decoration: none; margin-top: 12px; cursor: pointer; }
          .powered { text-align: center; font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 8px; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div className="logo">T</div>
          <div>
            <div className="restaurant-name">{restaurant.name}</div>
            <div className="cta">Scannez pour commander</div>
          </div>
        </div>

        {menu?.categories.map((cat) => (
          <div key={cat.id} className="category">
            <div className="category-name">{cat.name}</div>
            {cat.dishes.map((dish) => (
              <div key={dish.id} className="dish">
                <span className="dish-name">{dish.name}</span>
                <span className="dish-price">{dish.price.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ))}

        <a href={`/menu/${params.slug}`} target="_blank" className="open-btn">
          Voir le menu complet →
        </a>
        <div className="powered">Propulsé par Tableo</div>
      </body>
    </html>
  );
}
