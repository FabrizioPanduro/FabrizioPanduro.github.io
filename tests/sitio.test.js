import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const SITIO = '_site' // la carpeta que arma el job build

let doc

beforeAll(() => {
  const html = readFileSync(`${SITIO}/index.html`, 'utf-8')
  doc = new JSDOM(html).window.document
})

describe('index.html', () => {
  it('tiene un título', () => {
    expect(doc.title.trim()).not.toBe('')
  })

  it('muestra mi nombre en el h1', () => {
    expect(doc.querySelector('h1')?.textContent).toContain('Fabrizio')
  })

  it('todas las imágenes tienen texto alternativo', () => {
    const sinAlt = [...doc.querySelectorAll('img')].filter((img) => !img.getAttribute('alt'))
    expect(sinAlt).toHaveLength(0)
  })

  it('los archivos locales que usa la página existen', () => {
    const rutas = [...doc.querySelectorAll('script[src], link[rel="stylesheet"], img[src]')]
      .map((el) => el.getAttribute('src') ?? el.getAttribute('href'))
      .filter((ruta) => !/^(https?:)?\/\//.test(ruta)) // ignora lo que viene de Internet

    for (const ruta of rutas) {
      expect(existsSync(`${SITIO}/${ruta}`), `falta ${ruta}`).toBe(true)
    }
  })
})

describe('el sitio que se publica', () => {
  it('no incluye archivos internos del repositorio', () => {
    for (const interno of ['compose.yaml', '.env.example', 'api', 'db', 'tests']) {
      expect(existsSync(`${SITIO}/${interno}`), `${interno} no debería publicarse`).toBe(false)
    }
  })
})

describe('Pruebas personalizadas (B3)', () => {
  it('la página declara lang="es"', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('es')
  })

  it('hay un solo h1 en la página', () => {
    expect(doc.querySelectorAll('h1').length).toBe(1)
  })

  it('la sección del libro de visitas existe con sus campos', () => {
        // Usamos corchetes para buscar por el atributo 'name' tal como está en tu HTML
        expect(doc.querySelector('[name="nombre"]')).not.toBeNull()
        expect(doc.querySelector('[name="mensaje"]')).not.toBeNull()
      })

  it('el sitio no apunta a localhost', () => {
    const links = [...doc.querySelectorAll('a, form')]
    const apuntanALocal = links.some(el => {
      const dest = el.getAttribute('href') || el.getAttribute('action')
      return dest && dest.includes('localhost')
    })
    expect(apuntanALocal).toBe(false)
  })

  it('la página tiene la etiqueta meta viewport', () => {
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull()
  })
})