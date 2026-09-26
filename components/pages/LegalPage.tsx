'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { ShieldCheck, FileText, RefreshCw, Zap, HelpCircle, Mail } from 'lucide-react';

export function LegalPage() {
  const { activeLegalPage, openLegalPage } = useShop();

  const navItems = [
    { id: 'cgv', label: 'Conditions Générales de Vente (CGV)', icon: FileText },
    { id: 'privacy', label: 'Politique de Confidentialité (RGPD)', icon: ShieldCheck },
    { id: 'refund', label: 'Politique de Remboursement & Garantie', icon: RefreshCw },
    { id: 'delivery', label: 'Livraison Numérique & Téléchargements', icon: Zap },
    { id: 'faq', label: 'FAQ Globale', icon: HelpCircle },
  ];

  return (
    <div className="py-12 sm:py-18 bg-[#0B0F17] text-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Informations Légales &amp; Transparence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cadre contractuel &amp; Engagements clients
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Toutes les informations réglementaires relatives à la commande de licences et produits numériques.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLegalPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => openLegalPage(item.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-10 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-4xl mx-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* CGV */}
          {activeLegalPage === 'cgv' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
                Conditions Générales de Vente (CGV)
              </h2>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Objet &amp; Champ d&apos;application</h3>
                <p>
                  Les présentes Conditions Générales de Vente régissent de manière exclusive les relations contractuelles entre NOVALYS Digital (accessible 100% en ligne, contact : <strong className="text-white">cherchellsgpp@gmail.com</strong>) et toute personne physique ou morale passant commande de produits numériques, licences de logiciels et accès aux services dématérialisés.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Nature des produits &amp; Droit de rétractation</h3>
                <p>
                  Les produits commercialisés sont des contenus numériques non fournis sur un support matériel (clés d&apos;activation alphanumériques, liens d&apos;invitation officiels et abonnements).
                </p>
                <p>
                  Conformément à l&apos;article L. 221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture d&apos;un contenu numérique sans support matériel dont l&apos;exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation. Néanmoins, NOVALYS Digital offre contractuellement une garantie de remplacement ou de remboursement de 30 jours en cas d&apos;anomalie de fonctionnement.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Prix &amp; Modalités de paiement</h3>
                <p>
                  Les prix sont indiqués en Euros toutes taxes comprises (TTC). Le règlement s&apos;effectue comptant au moment de la passation de commande par Carte Bancaire (chiffrement SSL et 3D Secure), PayPal, Apple Pay ou Cryptomonnaies.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">4. Délais de livraison &amp; Exécution</h3>
                <p>
                  La délivrance des clés et tutoriels est effectuée immédiatement par voie électronique (email et coffre-fort client) en moins de 60 secondes après confirmation du règlement.
                </p>
              </section>
            </div>
          )}

          {/* Privacy */}
          {activeLegalPage === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
                Politique de Confidentialité &amp; Protection des Données (RGPD)
              </h2>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Données collectées</h3>
                <p>
                  Nous ne collectons que les données strictement indispensables au traitement et à la livraison de vos commandes numériques : adresse e-mail de réception de la licence et nom de facturation.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Sécurité des transactions bancaires</h3>
                <p>
                  NOVALYS Digital ne stocke à aucun moment vos coordonnées bancaires (numéros de carte, cryptogrammes). Les paiements sont traités de manière autonome et chiffrée par nos prestataires de paiement certifiés PCI-DSS (Stripe, PayPal).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Exercice de vos droits</h3>
                <p>
                  Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données personnelles sur simple demande adressée à notre DPO à : <strong className="text-cyan-400">cherchellsgpp@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* Refund */}
          {activeLegalPage === 'refund' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
                Politique de Garantie &amp; Remboursement (30 Jours)
              </h2>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Notre engagement de fiabilité à 100%</h3>
                <p>
                  Chaque clé vendue est garantie opérationnelle. Si lors de votre tentative d&apos;activation, la clé renvoie un message d&apos;erreur ou n&apos;est pas acceptée par les serveurs officiels, vous bénéficiez de notre garantie de remplacement direct.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Procédure simple de réclamation</h3>
                <p>
                  Envoyez simplement une capture d&apos;écran du message d&apos;erreur accompagnée de votre numéro de commande à <strong className="text-cyan-400">cherchellsgpp@gmail.com</strong>.
                </p>
                <p>
                  Notre équipe technique vérifie le journal d&apos;activation sous 15 minutes et vous délivre une clé de remplacement neuve ou procède au remboursement sous 24 à 48 heures ouvrées selon votre préférence.
                </p>
              </section>
            </div>
          )}

          {/* Delivery */}
          {activeLegalPage === 'delivery' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
                Modalités de Livraison Numérique
              </h2>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Aucun frais de port physique</h3>
                <p>
                  Tous nos produits sont 100% dématérialisés. Vous ne recevrez aucun colis physique par voie postale.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Déroulement de la livraison en 3 canaux</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Écran immédiat :</strong> Votre clé s&apos;affiche dès la confirmation du paiement sur la page de remerciement avec bouton de copie en 1 clic.</li>
                  <li><strong>Par E-mail :</strong> Un récapitulatif complet contenant la clé de licence officielle et le lien de téléchargement PDF du guide est envoyé à l&apos;adresse saisie.</li>
                  <li><strong>Coffre-fort client :</strong> Vos licences restent accessibles 24/7 dans votre espace &ldquo;Mes Licences&rdquo; sur notre plateforme.</li>
                </ul>
              </section>
            </div>
          )}

          {/* FAQ */}
          {activeLegalPage === 'faq' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
                Foire Aux Questions Complète
              </h2>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Les clés sont-elles valables à vie ou par abonnement ?
                  </h4>
                  <p>
                    Cela dépend de la nature du produit clairement indiquée sur la fiche. Les produits Microsoft Windows 11 et Office 2024 sont des licences perpétuelles à vie (paiement unique). Les produits comme ChatGPT Plus, Canva Pro ou Xbox Game Pass sont des abonnements pour la durée contractuelle choisie.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Que faire si je n&apos;ai pas reçu l&apos;e-mail contenant ma clé ?
                  </h4>
                  <p>
                    Vérifiez dans un premier temps votre dossier de spams / courriers indésirables. Si rien n&apos;apparaît après 2 minutes, votre clé reste consultable dans le bouton &ldquo;Mes Licences&rdquo; du site ou contactez-nous à <span className="text-cyan-400">cherchellsgpp@gmail.com</span> pour un renvoi manuel instantané.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
