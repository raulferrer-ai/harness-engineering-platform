# Ejemplo de nota técnica: ¿cuántos tokens consume una frase?

## Pregunta

¿Cuántos tokens consume una frase en castellano y por qué importa contar tokens?

## Respuesta corta

Un modelo no lee caracteres: lee tokens. En el tokenizador mínimo del módulo,
la frase de 80 caracteres ocupa 15 tokens (relación 0,188), y una palabra con
guiones se parte en cinco. Contar tokens es contar lo que el modelo ve y lo que
se factura.

## Afirmaciones

1. El texto se parte en tokens de longitud variable, no en caracteres.
2. Una palabra frecuente ocupa menos tokens que una palabra rara con guiones.
3. La relación entre tokens y caracteres no es constante: depende del texto.

## Evidencia

```text
$ node tokenizar.js
frase: El modelo de lenguaje predice el siguiente token. La plataforma es una academia.
caracteres: 80
tokens: 15
relación tokens/caracteres: 0.188
«modelo» → 1 token(s)
«harness-engineering-plataforma» → 5 token(s)
```

## Fuentes

- [The Illustrated GPT-2 (Jay Alammar)](https://jalammar.github.io/illustrated-gpt2/) — consultado el 2026-10-21
- [Hugging Face: Language Modeling tutorial](https://huggingface.co/docs/transformers/tasks/language_modeling) — consultado el 2026-10-21
