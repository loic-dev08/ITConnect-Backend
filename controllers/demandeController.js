import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import styles from '../css/ProProfil.module.css'



export default function ProProfil() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [pro, setPro]                 = useState(null)
  const [loadingPro, setLoadingPro]   = useState(true)
  const [erreurPro, setErreurPro]     = useState(false)

  const [form, setForm]       = useState({ objet: '', message: '' })
  const [erreurs, setErreurs] = useState({})
  const [loading, setLoading] = useState(false)
  const [succes, setSucces]   = useState(false)

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

  // ── Chargement du profil professionnel ──
  useEffect(() => {
    async function chargerProfil() {
      setLoadingPro(true)
      setErreurPro(false)
      try {
        const res = await api.get(`/professionnels/${id}`)
        setPro(res.data.professionnel)
      } catch (err) {
        setErreurPro(true)
      } finally {
        setLoadingPro(false)
      }
    }
    chargerProfil()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!currentUser) {
      setErreurs({ global: 'Vous devez être connecté pour envoyer une demande.' })
      return
    }
    if (!['particulier', 'entreprise'].includes(currentUser.role)) {
      setErreurs({ global: 'Seuls les particuliers et entreprises peuvent envoyer une demande.' })
      return
    }

    const erreursValidation = validerContact(form)
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation)
      return
    }

    setLoading(true)
    setErreurs({})
    try {
      await api.post('/demandes', {
        professionnelId: pro.id,
        objet: form.objet,
        message: form.message,
      })
      setSucces(true)
      setForm({ objet: '', message: '' })
    } catch (err) {
      const message = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
      setErreurs({ global: message })
    } finally {
      setLoading(false)
    }
  }

  // Chargement en cours
  if (loadingPro) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <p style={{ padding: '40px 0', textAlign: 'center' }}>Chargement du profil…</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Profil introuvable
  if (erreurPro || !pro) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>🔍</div>
            <p className={styles.notFoundTitle}>Professionnel introuvable</p>
            <p className={styles.notFoundText}>Ce profil n'existe pas ou a été supprimé.</p>
            <button className={styles.notFoundBtn} onClick={() => navigate('/recherche')}>
              Retour à la recherche
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Adaptation des données API au format attendu par le JSX ──
  const nom          = `${pro.user?.prenom || ''} ${pro.user?.nom || ''}`.trim()
  const initiales     = `${pro.user?.prenom?.[0] || ''}${pro.user?.nom?.[0] || ''}`
  const note           = pro.note_moyenne ? parseFloat(pro.note_moyenne) : 0
  const avisCount      = pro.nombre_avis || 0
  const competences    = Array.isArray(pro.competences) ? pro.competences : []
  const avisClients    = (pro.avis || []).map(a => ({
    id: a.id,
    initiales: `${a.client?.prenom?.[0] || ''}${a.client?.nom?.[0] || ''}`,
    nom: `${a.client?.prenom || ''} ${a.client?.nom || ''}`.trim(),
    role: '',
    ville: '',
    note: a.note,
    date: new Date(a.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    texte: a.texte,
  }))

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        <Link to="/recherche" className={styles.backLink}>
          ← Retour aux résultats
        </Link>

        <div className={styles.layout}>

          {/* ══ COLONNE GAUCHE ══ */}
          <aside className={styles.sidebar}>

            <div className={styles.profileCard}>
              <div className={styles.avatar}>{initiales}</div>
              <h1 className={styles.proName}>{nom}</h1>
              <p className={styles.proSpec}>{pro.specialite}</p>
              <span className={`${styles.dispoBadge} ${pro.disponible ? styles.dispoOn : styles.dispoOff}`}>
                {pro.disponible ? '● Disponible' : '○ Actuellement occupé'}
              </span>

              <div className={styles.noteRow}>
                <Stars note={note} />
                <span className={styles.noteValue}>{note}/5</span>
              </div>
              <span className={styles.avisCount}>{avisCount} avis clients</span>

              <ul className={styles.metaList}>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>📍</span>
                  {pro.ville}
                </li>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>💼</span>
                  {pro.experience || 'Non renseigné'} d'expérience
                </li>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>💶</span>
                  À partir de {pro.tarif || 'Sur devis'}
                </li>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>✅</span>
                  {pro.nombre_missions || 0} missions réalisées
                </li>
              </ul>
            </div>

            <div className={styles.contactCard}>
              <p className={styles.contactCardTitle}>Prêt à collaborer ?</p>
              <p className={styles.contactCardSub}>Envoyez votre demande directement à {nom.split(' ')[0]}</p>
              <button
                className={styles.contactCardBtn}
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ✉️ Envoyer une demande
              </button>
            </div>
          </aside>

          {/* ══ COLONNE DROITE ══ */}
          <main className={styles.main}>

            <div className={styles.card}>
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{pro.nombre_missions || 0}</span>
                  <span className={styles.statLabel}>Missions réalisées</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{note}/5</span>
                  <span className={styles.statLabel}>Note moyenne</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{avisCount}</span>
                  <span className={styles.statLabel}>Avis clients</span>
                </div>
              </div>
            </div>

            <section className={styles.card} aria-labelledby="bio-title">
              <h2 id="bio-title" className={styles.cardTitle}>À propos</h2>
              {(pro.bio || 'Aucune biographie renseignée.').split('\n\n').map((para, i, arr) => (
                <p key={i} className={styles.bio} style={{ marginBottom: i < arr.length - 1 ? 12 : 0 }}>
                  {para}
                </p>
              ))}
            </section>

            <section className={styles.card} aria-labelledby="skills-title">
              <h2 id="skills-title" className={styles.cardTitle}>Compétences & outils</h2>
              <div className={styles.skillsGrid}>
                {competences.map((c, i) => (
                  <span key={i} className={styles.skill}>
                    <span className={styles.skillIcon}>{c.icon}</span>
                    {c.label}
                  </span>
                ))}
              </div>
            </section>

            <section className={styles.card} aria-labelledby="avis-title">
              <h2 id="avis-title" className={styles.cardTitle}>
                Avis clients ({avisClients.length})
              </h2>
              {avisClients.length > 0 ? (
                <div className={styles.avisList}>
                  {avisClients.map(a => (
                    <div key={a.id} className={styles.avisCard}>
                      <div className={styles.avisHeader}>
                        <div className={styles.avisAuteur}>
                          <div className={styles.avisAvatar}>{a.initiales}</div>
                          <div>
                            <p className={styles.avisNom}>{a.nom}</p>
                            <span className={styles.avisRole}>{a.role} {a.ville}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Stars note={a.note} />
                          <span className={styles.avisDate}>{a.date}</span>
                        </div>
                      </div>
                      <p className={styles.avisTexte}>"{a.texte}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9A8FBD', fontSize: 13 }}>Aucun avis pour le moment.</p>
              )}
            </section>

            <section className={styles.card} id="contact-form" aria-labelledby="contact-title">
              <h2 id="contact-title" className={styles.cardTitle}>
                Envoyer une demande à {nom.split(' ')[0]}
              </h2>

              {succes ? (
                <div className={styles.successBanner}>
                  ✅ Votre demande a bien été envoyée ! {nom.split(' ')[0]} vous répondra dans les meilleurs délais.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="objet" className={styles.label}>Objet de la demande</label>
                    <select
                      id="objet"
                      name="objet"
                      value={form.objet}
                      onChange={handleChange}
                      className={`${styles.select} ${erreurs.objet ? styles.inputError : ''}`}
                      aria-describedby={erreurs.objet ? 'objet-error' : undefined}
                    >
                      <option value="">-- Choisissez un objet --</option>
                      <option value="Dépannage urgent">🔧 Dépannage urgent</option>
                      <option value="Projet ponctuel">📋 Projet ponctuel</option>
                      <option value="Contrat de maintenance">🔄 Contrat de maintenance</option>
                      <option value="Audit / Conseil">🔍 Audit / Conseil</option>
                      <option value="Formation">🎓 Formation</option>
                      <option value="Autre">💬 Autre</option>
                    </select>
                    {erreurs.objet && (
                      <p id="objet-error" className={styles.errorMsg} role="alert">⚠ {erreurs.objet}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="message" className={styles.label}>Décrivez votre besoin</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={`Bonjour ${nom.split(' ')[0]}, j'aurais besoin de votre aide pour…`}
                      className={`${styles.textarea} ${erreurs.message ? styles.inputError : ''}`}
                      aria-describedby={erreurs.message ? 'message-error' : undefined}
                    />
                    {erreurs.message && (
                      <p id="message-error" className={styles.errorMsg} role="alert">⚠ {erreurs.message}</p>
                    )}
                  </div>

                  {erreurs.global && (
                    <p className={styles.errorMsg} role="alert">⚠ {erreurs.global}</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading && <span className={styles.spinner} aria-hidden="true" />}
                    {loading ? 'Envoi en cours…' : '✉️ Envoyer ma demande'}
                  </button>

                </form>
              )}
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}