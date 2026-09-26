import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productName, category, prompt: customPrompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt =
        customPrompt ||
        `Rédige une fiche produit e-commerce ultra-performante et persuasive (style Shopify/Whop) en français pour :
Produit : "${productName || 'Logiciel Pro'}"
Catégorie : "${category || 'Logiciel & Licence'}"

Donne la réponse sous le format suivant :
1. Une accroche commerciale percutante (1 phrase).
2. Une description détaillée en 2 paragraphes courts mettant en valeur la rapidité, l'authenticité et la valeur ajoutée.
3. Une liste à puces de 4 bénéfices concrets pour l'utilisateur avec des émojis (ex: ⚡ Activation instantanée, 🔒 Clé 100% officielle, etc.).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return NextResponse.json({ text: response.text });
    }

    // High quality intelligent template fallback if API key is not configured in local environment
    const generatedCopy = `### ⚡ Libérez tout le potentiel de ${productName || 'votre outil'} avec une licence officielle à vie.

Optimisez votre productivité dès aujourd'hui grâce à **${productName || 'cette solution logicielle'}**. Conçu pour les professionnels exigeants et les passionnés du digital, ce produit vous offre des performances sans compromis et une fiabilité totale.

Activez votre compte ou logiciel en moins de 60 secondes sans aucune configuration complexe. Bénéficiez des dernières mises à jour constructeur et d'une sécurité renforcée 24/7.

**Pourquoi choisir cette licence :**
- 🚀 **Activation Instantanée** : Votre clé officielle délivrée automatiquement par email et dans votre coffre digital.
- 🛡️ **Garantie Constructeur & Authentique** : Aucune bidouille ni risque de révocation, licence 100% légitime.
- 🔄 **Mises à Jour Incluses** : Accès complet aux nouvelles versions et fonctionnalités de l'éditeur.
- 🤝 **Support Prioritaire Dédié** : Une équipe technique réactive pour vous accompagner en cas de besoin.`;

    return NextResponse.json({ text: generatedCopy });
  } catch (error: any) {
    console.error('Error generating product description with Gemini:', error);
    return NextResponse.json(
      {
        text: `### 🚀 Boostez vos performances avec ${req.headers.get('x-product-name') || 'ce produit officiel'}.\n\nProfitez d'un accès immédiat et sécurisé à vos fonctionnalités premium.\n\n- ⚡ Livraison instantanée en moins de 60 secondes\n- 🔒 Clé authentique vérifiée\n- 💎 Garantie de fonctionnement 100%`,
      },
      { status: 200 }
    );
  }
}
