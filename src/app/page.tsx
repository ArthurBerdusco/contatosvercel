import { neon } from '@neondatabase/serverless';

export default function Home() {

  async function create(formData: FormData) {
    'use server';

    const sql = neon(`${process.env.DATABASE_URL}`);

    const nome = formData.get('nome');
    const numero = formData.get('numero');

    await sql`INSERT INTO contatos (nome, numero) VALUES (${nome}, ${numero})`;
  }

  async function criar100() {
    'use server';

    const sql = neon(`${process.env.DATABASE_URL}`);

    const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana'];

    function getRandomName() {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Costa', 'Ferreira'];
      return `${nome} ${sobrenome[Math.floor(Math.random() * sobrenome.length)]}`;
    }

    function getRandomPhone() {
      const ddd = Math.floor(Math.random() * 90 + 10);
      const prefixo = Math.floor(Math.random() * 9000 + 1000);
      const sufixo = Math.floor(Math.random() * 9000 + 1000);
      return `(${ddd}) 9${prefixo}-${sufixo}`;
    }

    for (let i = 0; i < 10000; i++) {
      const nome = getRandomName();
      const numero = getRandomPhone();
      await sql`INSERT INTO contatos (nome, numero) VALUES (${nome}, ${numero})`;
    }

  }

  return (
    <>
      <form action={create}>
        <label htmlFor="">Nome: </label>
        <input type="text" name='nome' />

        <label htmlFor="">Número</label>
        <input type="text" name='numero' />

        <button type='submit'>Salvar</button>
      </form>

      <form action={criar100}>
        <label htmlFor="">REPETIÇÃO</label>
        <button type='submit' className='bg-red-300 rounded m-4'>CRIAR</button>
      </form>

    </>

  );
}
