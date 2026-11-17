// Les modèles sont remplacés par des doubles : aucun accès à la base de données
jest.mock('../models', () => ({
  User: { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
  Professionnel: { create: jest.fn() },
}))
process.env.JWT_SECRET = 'secret_de_test'

const { User } = require('../models')
const { autoriser, authentifier } = require('../middlewares/auth')
const gestionErreurs = require('../middlewares/erreurs')
const { inscription } = require('../controllers/authController')

const resFactice = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json   = jest.fn().mockReturnValue(res)
  return res
}

beforeAll(() => { jest.spyOn(console, 'error').mockImplementation(() => {}) })
beforeEach(() => { jest.clearAllMocks() })

describe('autoriser (TU1, TU2)', () => {
  test('TU1 - laisse passer un rôle autorisé', () => {
    const next = jest.fn()
    autoriser('professionnel')({ user: { role: 'professionnel' } }, resFactice(), next)
    expect(next).toHaveBeenCalled()
  })
  test('TU2 - refuse un rôle non autorisé (403)', () => {
    const res = resFactice(), next = jest.fn()
    autoriser('professionnel')({ user: { role: 'particulier' } }, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })
})

describe('gestionErreurs (TU3 à TU5)', () => {
  test('TU3 - doublon SQL -> 409', () => {
    const res = resFactice()
    gestionErreurs({ name: 'SequelizeUniqueConstraintError' }, {}, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(409)
  })
  test('TU4 - jeton invalide -> 401 « Token invalide. »', () => {
    const res = resFactice()
    gestionErreurs({ name: 'JsonWebTokenError' }, {}, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide.' })
  })
  test('TU5 - erreur inconnue -> 500 sans détail interne', () => {
    const res = resFactice()
    gestionErreurs(new Error('secret interne'), {}, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur interne du serveur.' })
  })
})

describe('inscription (TU6 à TU7)', () => {
  const corps = { prenom: 'Ada', nom: 'Test', email: 'ada@test.fr', motDePasse: 'Abcdefg1', role: 'particulier' }

  test('TU6 - mot de passe faible refusé (400), aucun compte créé', async () => {
    const res = resFactice()
    await inscription({ body: { ...corps, motDePasse: 'abc' } }, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
    expect(User.create).not.toHaveBeenCalled()
  })
  test('TU7 - le rôle « admin » devient « particulier » (liste blanche)', async () => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({ id: 1, toJSON: () => ({ id: 1 }) })
    const res = resFactice()
    await inscription({ body: { ...corps, role: 'admin' } }, res, jest.fn())
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'particulier' }))
    expect(res.status).toHaveBeenCalledWith(201)
  })
})

describe('authentifier (TU8)', () => {
  test('TU8 - requête sans jeton -> 401 « Token manquant. »', async () => {
    const res = resFactice(), next = jest.fn()
    await authentifier({ headers: {} }, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant.' })
    expect(next).not.toHaveBeenCalled()
  })
})