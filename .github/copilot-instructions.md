# Reglas Base de Desarrollo (Nexus Biblical Timeline)

## Stack Tecnológico y Arquitectura
- Framework: Next.js (App Router) con React y TypeScript.
- Estilos: Exclusivamente Tailwind CSS. Prohibido usar CSS en línea.
- Tipado Estricto: Prohibido declarar interfaces (`interface` o `type`) dentro del archivo de un componente. Todas las interfaces deben importarse desde la carpeta `app/types/`.

## Sistema de Diseño (Obligatorio)
REQUISITO ESTRICTO: Antes de generar código de UI, debes leer y aplicar el archivo `DESIGN.md` ubicado en la raíz.
- Aplica el sistema Neo-Swiss: Utiliza sombras duras (`box-shadow: 4px 4px 0px #111111`) en lugar de desenfoques.
- Geometría: Usa bordes rectos (radius 0) para paneles y radius 4px máximo para botones.
- Respeta estrictamente los colores semánticos definidos: Prophetic Teal, Conflict Crimson, Sovereign Gold y World Violet. No inventes colores que no estén en `DESIGN.md`.

## Arquitectura de Pantallas y Requisitos
REQUISITO ESTRICTO: Para conocer el layout, dimensiones y comportamiento de la aplicación, debes leer los siguientes dos archivos en la raíz:
1. `requirements.md`: Para entender la división del lienzo (60% carril bíblico, 40% carril secular) y los objetivos generales.
2. `PRD_nexus.md`: Para conocer las especificaciones exactas de cada componente (Macro Canvas, Context Panel, Era Detail, Search Matrix).