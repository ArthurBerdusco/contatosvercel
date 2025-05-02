// app/page.tsx
import { neon } from '@neondatabase/serverless'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const sql = neon(`${process.env.DATABASE_URL}`)

// CREATE
async function create(formData: FormData) {
  'use server'
  const nome = formData.get('nome')?.toString()
  const numero = formData.get('numero')?.toString()

  if (!nome || !numero) return
  await sql`INSERT INTO contatos (nome, numero) VALUES (${nome}, ${numero})`

  revalidatePath('/')
  return redirect('/')
}

// READ
async function getContatos() {
  'use server'
  const result = await sql`SELECT * FROM contatos ORDER BY id DESC`
  return result
}

// DELETE
async function excluirContato(formData: FormData) {
  'use server'
  const id = formData.get('id')?.toString()
  if (!id) return
  await sql`DELETE FROM contatos WHERE id = ${id}`

  revalidatePath('/')
  return redirect('/')
}

// UPDATE
async function editarContato(formData: FormData) {
  'use server'
  const id = formData.get('id')?.toString()
  const nome = formData.get('nome')?.toString()
  const numero = formData.get('numero')?.toString()

  if (!id || !nome || !numero) return
  await sql`UPDATE contatos SET nome = ${nome}, numero = ${numero} WHERE id = ${id}`

  revalidatePath('/')
  return redirect('/')
}

// COMPONENTE PRINCIPAL
export default async function Home() {
  const contatos = await getContatos()

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contatos</h1>

      {/* FORM DE CRIAÇÃO */}
      <form action={create} className="space-y-2 mb-8">
        <input name="nome" placeholder="Nome" className="border p-2 w-full" required />
        <input name="numero" placeholder="Número" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Criar Contato
        </button>
      </form>

      {/* LISTA DE CONTATOS */}
      {contatos.length === 0 ? (
        <p>Nenhum contato encontrado.</p>
      ) : (
        contatos.map((contato: any) => (
          <div key={contato.id} className="border p-4 mb-4 rounded space-y-2">
            <form action={editarContato} className="flex flex-col sm:flex-row gap-2">
              <input type="hidden" name="id" value={contato.id} />
              <input
                name="nome"
                defaultValue={contato.nome}
                className="border p-2 w-full"
              />
              <input
                name="numero"
                defaultValue={contato.numero}
                className="border p-2 w-full"
              />
              <button type="submit" className="bg-green-500 text-white px-4 rounded">
                Editar
              </button>
            </form>

            <form action={excluirContato}>
              <input type="hidden" name="id" value={contato.id} />
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-1 rounded mt-2"
              >
                Deletar
              </button>
            </form>
          </div>
        ))
      )}
    </main>
  )
}
