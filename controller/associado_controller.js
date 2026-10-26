import connect from "../config/connection.js";

const con = await connect();
const associado = {};

// Cadastrar associado
associado.create = async (req, res) => {
    try {
        const { cpf_associado, nome_associado, email_associado } = req.body;

        if (!cpf_associado || !nome_associado || !email_associado) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        if (!/^\d{11}$/.test(cpf_associado)) {
            return res.status(400).json({
                erro: "O CPF deve conter 11 dígitos."
            });
        }

        const [result] = await con.execute(
            `INSERT INTO associado
            (cpf_associado, nome_associado, email_associado)
            VALUES (?, ?, ?)`,
            [cpf_associado, nome_associado, email_associado]
        );

        res.status(201).json({
            mensagem: "Associado cadastrado com sucesso."
        });

    } catch (e) {
        console.error(e);

        res.status(e.code === "ER_DUP_ENTRY" ? 409 : 500).json({
            erro: e.code === "ER_DUP_ENTRY"
                ? "CPF já cadastrado."
                : "Erro ao cadastrar associado."
        });
    }
};

// Listar associados
associado.all = async (req, res) => {
    try {
        const [rows] = await con.execute(
            "SELECT * FROM associado ORDER BY nome_associado"
        );

        res.json(rows);

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao listar associados." });
    }
};

// Buscar associado por CPF
associado.findByCpf = async (req, res) => {
    try {
        const [rows] = await con.execute(
            "SELECT * FROM associado WHERE cpf_associado = ?",
            [req.params.cpf]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                erro: "Associado não encontrado."
            });
        }

        res.json(rows[0]);

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao buscar associado." });
    }
};

// Atualizar associado
associado.update = async (req, res) => {
    try {
        const { nome_associado, email_associado } = req.body;
        const cpf = req.params.cpf;

        if (!nome_associado || !email_associado) {
            return res.status(400).json({
                erro: "Informe o nome e o e-mail."
            });
        }

        const [rows] = await con.execute(
            "SELECT cpf_associado FROM associado WHERE cpf_associado = ?",
            [cpf]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                erro: "Associado não encontrado."
            });
        }

        await con.execute(
            `UPDATE associado
            SET nome_associado = ?, email_associado = ?
            WHERE cpf_associado = ?`,
            [nome_associado, email_associado, cpf]
        );

        res.json({ mensagem: "Associado atualizado com sucesso." });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao atualizar associado." });
    }
};

// Exclusão lógica: desativar associado
associado.remove = async (req, res) => {
    try {
        const [result] = await con.execute(
            "UPDATE associado SET ativo = FALSE WHERE cpf_associado = ?",
            [req.params.cpf]
        );

        if (result.affectedRows === 0) {
            const [rows] = await con.execute(
                "SELECT cpf_associado FROM associado WHERE cpf_associado = ?",
                [req.params.cpf]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    erro: "Associado não encontrado."
                });
            }
        }

        res.json({ mensagem: "Associado desativado com sucesso." });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao desativar associado." });
    }
};

// Exclusão definitiva: apagar do banco
associado.deletePermanent = async (req, res) => {
    try {
        const [result] = await con.execute(
            "DELETE FROM associado WHERE cpf_associado = ?",
            [req.params.cpf]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: "Associado não encontrado."
            });
        }

        res.json({ mensagem: "Associado excluído definitivamente." });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao excluir associado." });
    }
};

export default associado;