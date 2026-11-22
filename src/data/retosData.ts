import { Carrera, Reto } from '../types/rolelab';

export const TERMINOS_GLOSARIO: Record<string, { palabra: string; definicion: string }> = {
  'HTTP 500': {
    palabra: 'Error 500 (Fallo interno)',
    definicion:
      'Significa que el sistema tuvo un fallo interno y no pudo entregar la respuesta que le pidió la página. No falla tu internet ni tu celular: el problema está dentro del sistema.',
  },
  'Latencia p95': {
    palabra: 'Tiempo de carga (Latencia)',
    definicion:
      'Tiempo que tarda en abrir una pantalla después de hacer clic. Si marca 2.4 s (2.4 segundos), los estudiantes sienten la app lenta o congelada.',
  },
  'Connection Pool': {
    palabra: 'Ventanillas de conexión (Connection Pool)',
    definicion:
      'Grupo limitado de 100 "ventanillas" abiertas para hablar con el archivo central de datos. Si una pantalla las ocupa todas, los demás usuarios quedan haciendo fila hasta que la página falla.',
  },
  'Caché Redis': {
    palabra: 'Copia rápida temporal (Caché Redis)',
    definicion:
      'Una "mesa de entregas rápidas" temporal. Guarda durante 60 segundos respuestas repetidas (como historiales pasados) para entregarlas al instante sin hacer trabajar de más al archivo central.',
  },
  'Query N+1': {
    palabra: 'Preguntas repetidas (Query N+1)',
    definicion:
      'Ejemplo: en vez de buscar de una sola vez la lista de estudiantes que asistieron a una clase, el sistema pregunta uno por uno si cada estudiante asistió o no, repitiendo consultas hasta hacer 420 en lugar de una sola. Con 10 cuentas casi ni se nota, pero con mucha gente a la vez tarda 1.85 s y da Error 500.',
  },
  'Trade-off': {
    palabra: 'Sacrificio consciente (Trade-off)',
    definicion:
      'Elegir qué pequeña molestia aceptas hoy (que un historial tarde 60 segundos en actualizarse) para ganar algo urgente (que nadie quede fuera de su clase en vivo).',
  },
  'Rate-limiting': {
    palabra: 'Límite de recargas (Rate-limiting)',
    definicion:
      'Regulador de turnos en la entrada de una función. Limita cuántas veces por minuto puede recargarse una pantalla pesada para evitar que los clics repetidos saturen el sistema.',
  },
  'Consistencia eventual': {
    palabra: 'Actualización con pausa corta',
    definicion:
      'Tu asistencia nueva se guarda segura al instante, pero la lista de historial pasado puede tardar unos 60 segundos en mostrar ese último cambio mientras se renueva la copia rápida.',
  },
  'Falso positivo': {
    palabra: 'Falsa alarma (Falso positivo)',
    definicion:
      'Cuando un sistema automático o IA confunde algo normal (miles de estudiantes entrando a clase a las 8:00 a.m.) con un ataque malicioso y termina bloqueando a personas reales.',
  },
  Endpoint: {
    palabra: 'Petición / Ventanilla (Endpoint)',
    definicion:
      'Es como la "ventanilla" o dirección interna a la que llama la página para pedir (GET) o enviar (POST) información. Por ejemplo, GET /api/asistencia/historial pide el historial de asistencia; si sale bien (OK 200) entrega esos datos, y si falla (Error 500) el sistema tuvo un fallo interno y no pudo responder.',
  },
  PostgreSQL: {
    palabra: 'Archivo central de datos (PostgreSQL)',
    definicion:
      'El archivo digital principal donde la plataforma guarda de forma ordenada usuarios, clases y asistencias. Si se satura, toda la app se vuelve lenta o deja de guardar datos.',
  },
  SQL: {
    palabra: 'SQL',
    definicion:
      'El idioma con el que la aplicación pide o guarda información en el archivo central (por ejemplo, buscar asistencias o registrar una nueva).',
  },
  ORM: {
    palabra: 'ORM',
    definicion:
      'Traductor automático entre el código de programación y el archivo central SQL. Ahorra tiempo al programar, pero si se usa sin cuidado puede enviar cientos de preguntas ocultas.',
  },
  SLA: {
    palabra: 'Meta de calidad (SLA)',
    definicion:
      'Compromiso de calidad con quienes usan la plataforma: lograr que funcione al menos 95% de las veces y cargue en menos de 0.4 segundos.',
  },
  Backend: {
    palabra: 'Backend',
    definicion:
      'La parte "detrás de escena" de una app: revisa permisos, aplica reglas, habla con el archivo de datos y envía la respuesta a tu pantalla.',
  },
  DBA: {
    palabra: 'Especialista en datos (DBA)',
    definicion:
      'Persona encargada de cuidar que el archivo central de datos (PostgreSQL) sea rápido, esté respaldado y nunca pierda información.',
  },
  SRE: {
    palabra: 'Confiabilidad del servicio (SRE)',
    definicion:
      'Especialidad enfocada en que una aplicación siga estable, rápida y dentro del presupuesto cuando miles de personas entran al mismo tiempo.',
  },
  DDoS: {
    palabra: 'Ataque de saturación (DDoS)',
    definicion:
      'Ataque donde miles de computadores envían clics falsos al mismo tiempo para tumbar una página. A veces se parece a una hora pico normal de estudiantes.',
  },
  TTL: {
    palabra: 'Tiempo de vida (TTL)',
    definicion:
      'Segundos que dura guardada una copia rápida (por ejemplo, 60 segundos) antes de borrarse y volver a actualizarse.',
  },
  Logs: {
    palabra: 'Diario del servidor (Logs)',
    definicion:
      'Registro automático donde la plataforma anota cada clic que recibe: a qué hora llegó, cuánto tardó y si terminó bien o con error.',
  },
  Grafana: {
    palabra: 'Grafana',
    definicion:
      'Tablero visual parecido al de un carro: muestra en vivo qué tan rápida va la app, cuántos errores salen y si las ventanillas de datos se están llenando.',
  },
  'Datadog APM': {
    palabra: 'Datadog APM',
    definicion:
      'Funciona como unos rayos X para cada clic: sigue su viaje paso a paso y señala exactamente en qué función se pierde el tiempo.',
  },
  'Pruebas de carga': {
    palabra: 'Simulacro de hora pico (Pruebas de carga)',
    definicion:
      'Prueba segura antes de publicar: robots virtuales envían miles de clics al mismo tiempo para comprobar si la app resiste sin caer.',
  },
  'Balanceador de carga': {
    palabra: 'Repartidor de tráfico (Balanceador)',
    definicion:
      'Coordinador en la entrada que reparte a los usuarios entre varios servidores para que ninguno se llene mientras otros están libres.',
  },
};

export const CARRERAS: Carrera[] = [
  {
    id: 'ingenieria-software-cloud',
    titulo: 'Ingeniería de Software / Cloud & QA-SRE',
    area: 'Tecnología & Cloud',
    activa: true,
    retoId: 'cs-caida-8am',
    retoTitulo: 'Caída a las 8:00 a.m.',
    duracionEstimada: '15–20 min',
    nivelEntrada: 'Nivel 1 · Graduate / Junior',
    imagenPortada: '/src/assets/images/career_cloud_engineering_1795108986228.jpg',
    videoExplicativoUrl: 'https://www.youtube.com/watch?v=HsUuqX4ILq4',
    resumenCorto:
      'Cuida que plataformas usadas por miles de personas al mismo tiempo no se caigan ni pierdan datos. Investiga fallos reales, lee pistas del sistema y decide cómo arreglarlos sin gastar de más.',
    acercaDe: {
      queTrata:
        ' La Ingeniería de Software se encarga de crear y mantener soluciones tecnológicas que resuelven problemas y responden a las necesidades de las personas y las organizaciones. Para ello, combina el análisis de necesidades, el diseño, la programación y las pruebas, procurando que los sistemas funcionen correctamente y puedan mejorarse con el tiempo.',
      habilidadesClave: [
        'Leer gráficas de velocidad, errores y diarios del servidor (logs) para encontrar qué falló',
        'Entender cómo viaja un clic desde tu pantalla hasta la base de datos y las copias rápidas (caché)',
        'Mantener la calma y decidir en orden cuando hay presión de tiempo',
        'Traducir problemas técnicos en mensajes claros para soporte, programación y base de datos',
        'Comparar intercambios (trade-offs): qué ganas y qué cedes en velocidad, estabilidad y dinero',
      ],
      requerimientos: [
        'Curiosidad de detective para conectar síntomas visibles con pistas reales antes de adivinar',
        'Ganas de entender qué pasa detrás de escena cuando presionas un botón en una app',
        'Criterio responsable para nunca borrar ni arriesgar datos reales de personas por salir del paso',
      ],
      actividadesGenerales: [
        'Vigilar tableros de salud del sistema en horarios críticos (como inicios de clase o exámenes)',
        'Seguir el rastro de una pantalla lenta hasta descubrir qué parte del código o base de datos se atascó',
        'Aplicar soluciones seguras que alivien el sistema sin desconectar a quienes ya están adentro',
        'Contar al equipo qué pasó y cómo evitar que vuelva a ocurrir, sin buscar culpables sino mejorar el sistema',
      ],
    },
    piramideProgresion: [
      {
        nivel: 4,
        titulo: 'Dirección / Principal',
        rangoExperiencia: '12+ años',
        etapa: 'Estrategia tecnológica, decisiones de alto impacto y ruta Principal',
        activoEnReto: false,
        roles: ['Principal Engineer / Architect', 'Head of Engineering', 'VP of Infrastructure'],
        enfoque:
          'Define la estrategia tecnológica a largo plazo, lidera decisiones de alto impacto y alinea la arquitectura con las metas del negocio, o profundiza como especialista técnico avanzado (Principal).',
        responsabilidades: [
          'Decidir en qué arquitectura y presupuesto cloud invertir según el crecimiento real del servicio',
          'Resolver los retos técnicos más difíciles de escala o guiar a los líderes de múltiples equipos',
        ],
        descripcionEtapa:
          'En la cima de la carrera defines estrategias tecnológicas a largo plazo, lideras decisiones de alto impacto para miles o millones de usuarios y alineas las soluciones técnicas con las metas de la empresa. En este nivel también existe la ruta de especialista técnico avanzado (Principal): profesionales que profundizan en arquitectura y resuelven los desafíos más complejos sin tener que pasar necesariamente a un cargo gerencial.',
        cargosDisponibles: [
          {
            id: 'principal-engineer',
            titulo: 'Principal Engineer / Architect',
            descripcionBreve:
              'Especialista técnico de máximo nivel que resuelve problemas estructurales sin asumir necesariamente jefatura de personas.',
            queHaceEnJornada: [
              'Evalúa decisiones técnicas que afectarán a toda la plataforma durante los próximos 3 a 5 años.',
              'Revisa propuestas de arquitectura de distintos equipos para evitar cuellos de botella invisibles.',
              'Investiga fallos inéditos de escala cuando varias partes del sistema interactúan a la vez.',
            ],
            problemasQueResuelve: [
              'Cómo atender a 500,000 usuarios simultáneos sin multiplicar por diez el costo mensual en la nube.',
              'Qué datos deben actualizarse al instante y cuáles pueden esperar unos segundos sin afectar al usuario.',
              'Cómo dividir un sistema gigante en piezas manejables sin detener el servicio actual.',
            ],
            herramientas: [
              {
                nombre: 'Trade-off',
                terminoGlosario: 'Trade-off',
                resumenUso: 'Evalúa qué gana y qué cede cada arquitectura en velocidad, estabilidad y costo.',
                icono: 'layers',
              },
              {
                nombre: 'Consistencia eventual',
                terminoGlosario: 'Consistencia eventual',
                resumenUso: 'Define en qué pantallas basta con datos casi inmediatos para evitar saturar la base central.',
                icono: 'server',
              },
              {
                nombre: 'Balanceador de carga',
                terminoGlosario: 'Balanceador de carga',
                resumenUso: 'Diseña cómo repartir tráfico entre regiones y servidores cuando hay picos masivos.',
                icono: 'network',
              },
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Establece los compromisos de disponibilidad y rapidez que toda la empresa debe cumplir.',
                icono: 'shield',
              },
            ],
          },
          {
            id: 'head-of-engineering',
            titulo: 'Head of Engineering',
            descripcionBreve:
              'Lidera varios equipos de desarrollo y conecta las prioridades del negocio con el trabajo técnico diario.',
            queHaceEnJornada: [
              'Coordina a líderes técnicos para equilibrar nuevas funciones con la estabilidad de la plataforma.',
              'Define presupuestos anuales de infraestructura, herramientas y contratación de talento.',
              'Revisa indicadores globales de calidad tras incidentes importantes para mejorar procesos.',
            ],
            problemasQueResuelve: [
              'Evitar que la presión por lanzar funciones rápidas termine causando caídas frecuentes en horas pico.',
              'Priorizar qué problemas técnicos arreglar primero cuando todos los equipos piden tiempo y recursos.',
              'Asegurar que cada equipo tenga metas claras de calidad sin quemar al personal.',
            ],
            herramientas: [
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Vigila si la empresa cumple sus metas de servicio frente a colegios, clientes o usuarios.',
                icono: 'shield',
              },
              {
                nombre: 'Grafana',
                terminoGlosario: 'Grafana',
                resumenUso: 'Consulta tableros ejecutivos para detectar tendencias de latencia, fallos y capacidad.',
                icono: 'gauge',
              },
              {
                nombre: 'Trade-off',
                terminoGlosario: 'Trade-off',
                resumenUso: 'Decide junto a negocio si invertir en velocidad de lanzamiento o en resiliencia.',
                icono: 'layers',
              },
              {
                nombre: 'Logs',
                terminoGlosario: 'Logs',
                resumenUso: 'Respalda auditorías de incidentes críticos para aprender sin buscar culpables.',
                icono: 'terminal',
              },
            ],
          },
          {
            id: 'vp-infrastructure',
            titulo: 'VP of Infrastructure',
            descripcionBreve:
              'Responsable de que la nube, las bases de datos y la seguridad soporten el crecimiento total de la organización.',
            queHaceEnJornada: [
              'Planifica la capacidad de servidores y bases de datos para eventos masivos del año (matrículas o exámenes).',
              'Negocia contratos de nube y fija límites de gasto para mantener la operación sostenible.',
              'Supervisa planes de recuperación ante desastres si una región entera de servidores falla.',
            ],
            problemasQueResuelve: [
              'Mantener viva la plataforma incluso si falla un centro de datos completo del proveedor cloud.',
              'Detener el crecimiento descontrolado de facturas mensuales en servidores mal dimensionados.',
              'Proteger millones de registros sensibles cumpliendo normas legales y de privacidad.',
            ],
            herramientas: [
              {
                nombre: 'Balanceador de carga',
                terminoGlosario: 'Balanceador de carga',
                resumenUso: 'Redirige el tráfico mundial entre zonas activas cuando ocurre una falla mayor.',
                icono: 'network',
              },
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Supervisa políticas de respaldo y replicación del archivo central de datos.',
                icono: 'database',
              },
              {
                nombre: 'Caché Redis',
                terminoGlosario: 'Caché Redis',
                resumenUso: 'Aprueba capas globales de respuesta rápida para absorber picos nacionales o globales.',
                icono: 'cpu',
              },
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Garantiza disponibilidad contractual para instituciones y grandes clientes.',
                icono: 'shield',
              },
            ],
          },
        ],
        diferenciacion: {
          cargosResumen:
            'Puestos de mayor alcance, como Principal Engineer, Head of Engineering o VP of Infrastructure.',
          actividades: [
            'Aprobar presupuestos cloud y planes de crecimiento a 3–5 años',
            'Liderar revisiones de arquitectura entre múltiples equipos',
            'Alinear metas de servicio (SLA) con los objetivos del negocio',
          ],
          habilidades: [
            'Visión estratégica',
            'Decisiones bajo incertidumbre',
            'Arquitectura a escala',
            'Comunicación ejecutiva',
            'Mentoría de líderes',
          ],
          problemasResumen:
            'Escalar la plataforma a cientos de miles de usuarios sin disparar costos ni perder estabilidad.',
        },
        experienciaPractica: {
          tituloReto: 'Expansión nacional con presupuesto tope',
          duracionEstimada: '20–30 minutos',
          disponible: false,
          notaEstado:
            'Reto futuro proyectado para este nivel. Hoy puedes vivir la simulación completa en el Nivel 1.',
        },
      },
      {
        nivel: 3,
        titulo: 'Senior / Especialista',
        rangoExperiencia: '7–11 años',
        etapa: 'Diseño de soluciones complejas, estándares y mentoría técnica',
        activoEnReto: false,
        roles: ['Senior SRE', 'Tech Lead', 'Cloud Architect'],
        enfoque:
          'Diseña soluciones para problemas complejos, define estándares técnicos, evalúa arquitecturas y acompaña a otros desarrolladores o especialistas.',
        responsabilidades: [
          'Diseñar sistemas resistentes a fallos y definir reglas técnicas para todo el equipo',
          'Evaluar cambios delicados y mentorizar a perfiles junior e intermedios durante emergencias',
        ],
        descripcionEtapa:
          'En esta etapa pasas de resolver tareas concretas a diseñar soluciones para problemas complejos que cruzan varias partes del sistema. Defines estándares técnicos para que el equipo programe con calidad, evalúas arquitecturas antes de aprobar cambios delicados y acompañas como mentor a otros desarrolladores y especialistas que están creciendo.',
        cargosDisponibles: [
          {
            id: 'tech-lead',
            titulo: 'Tech Lead',
            descripcionBreve:
              'Guía las decisiones técnicas de un equipo completo, revisa propuestas delicadas y acompaña a quienes empiezan.',
            queHaceEnJornada: [
              'Revisa diseños y cambios de código complejos antes de que salgan a los usuarios reales.',
              'Coordina al equipo durante una emergencia para que nadie actúe a ciegas ni pierda datos.',
              'Dedica tiempo cada semana a explicar criterios de ingeniería y dar retroalimentación a juniors.',
            ],
            problemasQueResuelve: [
              'Elegir la solución más segura bajo presión cuando hay que proteger los datos y el presupuesto.',
              'Evitar que cada persona programe a su manera creando piezas incompatibles o frágiles.',
              'Traducir necesidades de usuarios y directivos en tareas técnicas claras y realistas.',
            ],
            herramientas: [
              {
                nombre: 'Datadog APM',
                terminoGlosario: 'Datadog APM',
                resumenUso: 'Usa los rayos X de peticiones para validar si un diseño nuevo crea cuellos de botella.',
                icono: 'activity',
              },
              {
                nombre: 'Trade-off',
                terminoGlosario: 'Trade-off',
                resumenUso: 'Compara opciones técnicas considerando velocidad, mantenimiento y presupuesto.',
                icono: 'layers',
              },
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Define reglas de acceso seguro al archivo central para evitar bloqueos masivos.',
                icono: 'database',
              },
              {
                nombre: 'Caché Redis',
                terminoGlosario: 'Caché Redis',
                resumenUso: 'Diseña estrategias de copia rápida con vencimiento seguro (TTL) para horas pico.',
                icono: 'cpu',
              },
            ],
          },
          {
            id: 'senior-sre',
            titulo: 'Senior SRE',
            descripcionBreve:
              'Especialista en confiabilidad que diseña sistemas capaces de resistir picos extremos y fallos parciales.',
            queHaceEnJornada: [
              'Define presupuestos de error y metas de respuesta (SLA) junto con los equipos de producto.',
              'Diseña mecanismos de protección automática para que una función secundaria no tumbe lo esencial.',
              'Lidera análisis post-incidente para transformar cada fallo humano o técnico en una mejora del sistema.',
            ],
            problemasQueResuelve: [
              'Aislar funciones no críticas (como historiales) para que nunca bloqueen funciones clave (entrar a clase).',
              'Ajustar límites de tráfico para frenar reintentos masivos sin bloquear a usuarios legítimos.',
              'Automatizar alertas precisas que avisen a tiempo sin generar falsas alarmas constantes.',
            ],
            herramientas: [
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Traduce expectativas de los usuarios en métricas exactas de disponibilidad y latencia.',
                icono: 'shield',
              },
              {
                nombre: 'Rate-limiting',
                terminoGlosario: 'Rate-limiting',
                resumenUso: 'Diseña reguladores de turno para proteger endpoints pesados durante horas pico.',
                icono: 'gauge',
              },
              {
                nombre: 'Datadog APM',
                terminoGlosario: 'Datadog APM',
                resumenUso: 'Detecta cadenas ocultas de lentitud entre servidores, caché y base de datos.',
                icono: 'activity',
              },
              {
                nombre: 'Consistencia eventual',
                terminoGlosario: 'Consistencia eventual',
                resumenUso: 'Aplica pausas tolerables en reportes para mantener vivas las acciones en tiempo real.',
                icono: 'server',
              },
            ],
          },
          {
            id: 'cloud-architect',
            titulo: 'Cloud Architect',
            descripcionBreve:
              'Diseña cómo se conectan servidores, bases de datos y redes en la nube para crecer con orden y seguridad.',
            queHaceEnJornada: [
              'Dibuja la arquitectura de nuevos servicios eligiendo dónde guardar datos y cómo repartir el tráfico.',
              'Revisa costos en la nube para reemplazar servidores sobredimensionados por diseños más eficientes.',
              'Define estándares de seguridad y respaldo entre múltiples aplicaciones de la empresa.',
            ],
            problemasQueResuelve: [
              'Evitar puntos únicos de falla donde un solo componente caído apague toda la plataforma.',
              'Conectar múltiples servicios internos sin perder velocidad ni abrir brechas de seguridad.',
              'Preparar la infraestructura antes de campañas escolares o lanzamientos con tráfico diez veces mayor.',
            ],
            herramientas: [
              {
                nombre: 'Balanceador de carga',
                terminoGlosario: 'Balanceador de carga',
                resumenUso: 'Planifica cómo distribuir miles de sesiones simultáneas entre varios servidores.',
                icono: 'network',
              },
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Diseña réplicas de lectura y ventanillas equilibradas para cargas exigentes.',
                icono: 'database',
              },
              {
                nombre: 'Caché Redis',
                terminoGlosario: 'Caché Redis',
                resumenUso: 'Ubica mesas de entrega rápida entre los usuarios y el archivo principal.',
                icono: 'cpu',
              },
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Valida que la arquitectura elegida cumpla la rapidez y disponibilidad prometidas.',
                icono: 'shield',
              },
            ],
          },
        ],
        diferenciacion: {
          cargosResumen:
            'Puestos de liderazgo técnico y especialidad profunda, como Tech Lead, Senior SRE o Cloud Architect.',
          actividades: [
            'Evaluar arquitecturas antes de aprobar cambios de alto riesgo',
            'Definir estándares de calidad, pruebas y manejo de fallos',
            'Mentorizar a perfiles junior e intermedios en casos complejos',
          ],
          habilidades: [
            'Pensamiento sistémico',
            'Criterio de riesgos',
            'Diseño de arquitecturas',
            'Estándares de calidad',
            'Liderazgo y mentoría',
          ],
          problemasResumen:
            'Fallos estructurales que cruzan varios equipos para que crecer no rompa la estabilidad.',
        },
        experienciaPractica: {
          tituloReto: 'Rediseño sin apagar el servicio en vivo',
          duracionEstimada: '20–30 minutos',
          disponible: false,
          notaEstado:
            'Reto futuro proyectado para este nivel. Hoy puedes vivir la simulación completa en el Nivel 1.',
        },
      },
      {
        nivel: 2,
        titulo: 'Intermedio / Mid-Level',
        rangoExperiencia: '3–6 años',
        etapa: 'Prevención automática, optimización y autonomía técnica',
        activoEnReto: false,
        roles: [
          'Site Reliability Engineer (SRE)',
          'Backend Engineer',
          'QA Automation Engineer',
        ],
        enfoque:
          'Pasa de investigar problemas a prevenirlos: diseña pruebas automáticas para simular horas pico, optimiza bases de datos y equilibra rendimiento, estabilidad y costos.',
        responsabilidades: [
          'Resolver incidentes de principio a fin con autonomía y crear defensas para que no se repitan',
          'Optimizar consultas SQL lentas y simular picos de usuarios antes de lanzar nuevas funciones',
        ],
        descripcionEtapa:
          'En esta etapa pasas de investigar problemas cuando ocurren a prevenirlos antes de que afecten a un solo usuario: diseñas pruebas automáticas para simular horas pico antes de lanzar cambios, optimizas consultas y estructuras de bases de datos para que no formen filas innecesarias, y aprendes a equilibrar rendimiento, estabilidad y costo mensual de operación.',
        cargosDisponibles: [
          {
            id: 'sre-mid',
            titulo: 'Site Reliability Engineer (SRE)',
            descripcionBreve:
              'Construye alertas inteligentes, protege rutas críticas y evita que los picos de tráfico tumben la app.',
            queHaceEnJornada: [
              'Configura tableros y alertas para detectar cuando el Connection Pool empieza a llenarse.',
              'Implementa reguladores de tráfico y capas de caché para proteger las funciones más usadas.',
              'Participa en guardias técnicas resolviendo incidentes complejos con autonomía.',
            ],
            problemasQueResuelve: [
              'Que un pico legítimo de usuarios sea confundido con un ataque por filtros automáticos mal calibrados.',
              'Reducir falsas alarmas configurando métricas útiles de latencia p95 y tasa de errores.',
              'Contener la saturación de recursos sin gastar presupuesto en servidores innecesarios.',
            ],
            herramientas: [
              {
                nombre: 'Grafana',
                terminoGlosario: 'Grafana',
                resumenUso: 'Crea gráficas y alertas tempranas sobre latencia, errores y uso de ventanillas.',
                icono: 'gauge',
              },
              {
                nombre: 'Datadog APM',
                terminoGlosario: 'Datadog APM',
                resumenUso: 'Analiza trazas detalladas para encontrar qué función frena una pantalla.',
                icono: 'activity',
              },
              {
                nombre: 'Rate-limiting',
                terminoGlosario: 'Rate-limiting',
                resumenUso: 'Configura límites de turnos por minuto para evitar reintentos en cascada.',
                icono: 'shield',
              },
              {
                nombre: 'SLA',
                terminoGlosario: 'SLA',
                resumenUso: 'Mide diariamente si la app cumple el 95%+ de disponibilidad y < 0.4 s.',
                icono: 'server',
              },
            ],
          },
          {
            id: 'backend-mid',
            titulo: 'Backend Engineer',
            descripcionBreve:
              'Programa la lógica interna del servidor y optimiza la base de datos para que soporte miles de clics.',
            queHaceEnJornada: [
              'Reescribe código lento que hace cientos de consultas seguidas para unirlas en una sola petición eficiente.',
              'Diseña nuevos endpoints y valida que usen correctamente la caché y los permisos.',
              'Revisa el código de compañeros para detectar errores de rendimiento antes de publicarlo.',
            ],
            problemasQueResuelve: [
              'Eliminar cuellos de botella como el Query N+1 que multiplican las consultas en horas pico.',
              'Evitar que una función secundaria bloquee las ventanillas de conexión al archivo central.',
              'Mantener respuestas rápidas sin duplicar costos de servidor.',
            ],
            herramientas: [
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Optimiza tablas, índices y consultas en el archivo central de la app.',
                icono: 'database',
              },
              {
                nombre: 'Caché Redis',
                terminoGlosario: 'Caché Redis',
                resumenUso: 'Programa respuestas rápidas en memoria temporal para datos repetidos.',
                icono: 'cpu',
              },
              {
                nombre: 'SQL',
                terminoGlosario: 'SQL',
                resumenUso: 'Escribe consultas unificadas (JOINs) que reemplazan cientos de viajes pequeños.',
                icono: 'code',
              },
              {
                nombre: 'ORM',
                terminoGlosario: 'ORM',
                resumenUso: 'Configura el traductor de código a SQL evitando consultas ocultas en bucle.',
                icono: 'layers',
              },
            ],
          },
          {
            id: 'qa-automation-mid',
            titulo: 'QA Automation Engineer',
            descripcionBreve:
              'Crea robots de prueba que simulan miles de estudiantes antes de que cualquier cambio salga al aire.',
            queHaceEnJornada: [
              'Escribe pruebas automáticas que verifican cada noche que los flujos clave sigan funcionando.',
              'Ejecuta simulacros con miles de usuarios virtuales para comprobar qué pasa en hora pico.',
              'Reporta con evidencia exacta qué endpoint falló y bajo cuánta carga ocurrió.',
            ],
            problemasQueResuelve: [
              'Detectar antes del lanzamiento errores que solo aparecen con miles de personas y nunca con 10 cuentas.',
              'Evitar regresiones donde arreglar una pantalla termina dañando otra función esencial.',
              'Medir con precisión si una corrección bajó realmente la latencia debajo de 0.4 s.',
            ],
            herramientas: [
              {
                nombre: 'Pruebas de carga',
                terminoGlosario: 'Pruebas de carga',
                resumenUso: 'Simula entradas masivas tipo 8:00 a.m. en un entorno seguro antes de publicar.',
                icono: 'gauge',
              },
              {
                nombre: 'Logs',
                terminoGlosario: 'Logs',
                resumenUso: 'Inspecciona el diario de peticiones durante los simulacros para confirmar 0 errores.',
                icono: 'terminal',
              },
              {
                nombre: 'Endpoint',
                terminoGlosario: 'Endpoint',
                resumenUso: 'Prueba ruta por ruta de la API comprobando tiempos de respuesta estables.',
                icono: 'code',
              },
              {
                nombre: 'HTTP 500',
                terminoGlosario: 'HTTP 500',
                resumenUso: 'Valida que ningún escenario límite devuelva fallos internos del servidor.',
                icono: 'shield',
              },
            ],
          },
        ],
        diferenciacion: {
          cargosResumen:
            'Puestos con autonomía técnica, como Site Reliability Engineer (SRE), Backend Engineer y QA Automation Engineer.',
          actividades: [
            'Programar pruebas de carga que simulen horas pico antes de publicar',
            'Reescribir consultas lentas en la base de datos para quitar filas',
            'Configurar cachés y límites de tráfico equilibrando rapidez y costo',
          ],
          habilidades: [
            'Prevención de fallos',
            'Autonomía técnica',
            'Optimización SQL',
            'Balance costo-velocidad',
            'Pruebas automatizadas',
          ],
          problemasResumen:
            'Cuellos de botella y rendimiento antes de que afecten al estudiante en horas pico.',
        },
        experienciaPractica: {
          tituloReto: 'Simulacro antes del examen nacional',
          duracionEstimada: '20–30 minutos',
          disponible: false,
          notaEstado:
            'Reto futuro proyectado para este nivel. Hoy puedes vivir la simulación completa en el Nivel 1.',
        },
      },
      {
        nivel: 1,
        titulo: 'Graduate / Junior',
        rangoExperiencia: '0–2 años',
        etapa: 'Simulación activa · Primer empleo o prácticas profesionales',
        activoEnReto: true,
        roles: [
          'Junior Production Support / QA Engineer',
          'Backend Developer Junior',
          'Cloud Operations Analyst',
        ],
        enfoque:
          'Tu punto de partida profesional: entiendes cómo respira una app con miles de personas reales, investigas errores leyendo logs con calma y proteges los datos.',
        responsabilidades: [
          'Distinguir síntomas reportados por usuarios de la causa oculta usando gráficas y logs',
          'Seguir procedimientos seguros para contener emergencias sin borrar datos reales',
        ],
        descripcionEtapa:
          'Al entrar al Nivel 1 descubres cómo respira una aplicación cuando miles de personas reales la usan al mismo tiempo: aprendes a distinguir lo que reporta el usuario en su pantalla de la causa oculta dentro del servidor, investigar errores paso a paso, leer diarios de errores (logs) con calma sin entrar en pánico, y seguir procedimientos seguros para proteger siempre los datos reales.',
        cargosDisponibles: [
          {
            id: 'junior-support-qa',
            titulo: 'Junior Production Support / QA Engineer',
            descripcionBreve:
              'Investiga fallos reales en vivo cruzando reportes de usuarios, gráficas de salud y logs del servidor.',
            queHaceEnJornada: [
              'Revisa alertas en horas pico (como las 8:00 a.m.) y confirma qué funciones fallan y cuáles siguen sanas.',
              'Lee el diario de peticiones (logs) para encontrar qué ruta acapara recursos antes de proponer cambios.',
              'Comunica hallazgos claros con pruebas reales a su líder técnico y al equipo de desarrollo.',
            ],
            problemasQueResuelve: [
              'Averiguar por qué los estudiantes ven errores HTTP 500 o pantallas lentas al entrar a clase.',
              'Separar falsas alarmas de cuellos de botella reales sin reiniciar servidores a ciegas.',
              'Verificar que las soluciones aplicadas mantengan a salvo las asistencias ya guardadas.',
            ],
            herramientas: [
              {
                nombre: 'Grafana',
                terminoGlosario: 'Grafana',
                resumenUso: 'Tablero del carro para ver latencia, errores y ventanillas ocupadas en tiempo real.',
                icono: 'gauge',
              },
              {
                nombre: 'Datadog APM',
                terminoGlosario: 'Datadog APM',
                resumenUso: 'Rayos X que muestran en qué ruta exacta se pierde el tiempo de cada clic.',
                icono: 'activity',
              },
              {
                nombre: 'Logs',
                terminoGlosario: 'Logs',
                resumenUso: 'Diario automático de peticiones para descubrir qué consulta saturó el sistema.',
                icono: 'terminal',
              },
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Archivo central de datos donde revisas cuántas ventanillas libres quedan.',
                icono: 'database',
              },
            ],
          },
          {
            id: 'backend-developer-junior',
            titulo: 'Backend Developer Junior',
            descripcionBreve:
              'Apoya construyendo y corrigiendo rutas internas de la app con supervisión de su equipo.',
            queHaceEnJornada: [
              'Programa funciones pequeñas del servidor siguiendo guías claras del Tech Lead.',
              'Corrige consultas lentas o errores puntuales detectados durante pruebas o incidentes.',
              'Verifica con pruebas básicas que cada endpoint devuelva la información correcta y segura.',
            ],
            problemasQueResuelve: [
              'Corregir funciones que hacen demasiadas preguntas repetidas a la base de datos.',
              'Ajustar mensajes de error y validaciones para que una falla menor no rompa toda la pantalla.',
              'Evitar que un cambio publicado ayer siga sobrecargando el servidor en hora pico.',
            ],
            herramientas: [
              {
                nombre: 'SQL',
                terminoGlosario: 'SQL',
                resumenUso: 'Idioma para pedir y guardar datos ordenados sin hacer viajes innecesarios.',
                icono: 'code',
              },
              {
                nombre: 'ORM',
                terminoGlosario: 'ORM',
                resumenUso: 'Traductor entre código y SQL que revisas para evitar el error Query N+1.',
                icono: 'layers',
              },
              {
                nombre: 'Endpoint',
                terminoGlosario: 'Endpoint',
                resumenUso: 'Dirección interna concreta donde pruebas si una función responde rápido.',
                icono: 'server',
              },
              {
                nombre: 'PostgreSQL',
                terminoGlosario: 'PostgreSQL',
                resumenUso: 'Base de datos principal donde confirmas que los registros queden bien guardados.',
                icono: 'database',
              },
            ],
          },
          {
            id: 'cloud-ops-analyst',
            titulo: 'Cloud Operations Analyst',
            descripcionBreve:
              'Vigila la salud diaria de los servidores en la nube, el tráfico de entrada y el presupuesto mensual.',
            queHaceEnJornada: [
              'Monitorea las gráficas de disponibilidad, velocidad de respuesta y uso de servidores.',
              'Verifica qué cambios de configuración ayudan a aliviar picos sin disparar la factura cloud.',
              'Documenta paso a paso qué ocurrió durante un incidente y cómo respondió la infraestructura.',
            ],
            problemasQueResuelve: [
              'Evitar gastos innecesarios cuando alguien propone comprar más servidores que no arreglan la raíz.',
              'Detectar si un pico de tráfico es una entrada normal a clases o un ataque externo.',
              'Mantener disponibles copias rápidas en caché para que los usuarios no pierdan acceso.',
            ],
            herramientas: [
              {
                nombre: 'Grafana',
                terminoGlosario: 'Grafana',
                resumenUso: 'Vigila el tablero de salud del sistema y las horas de mayor demanda.',
                icono: 'gauge',
              },
              {
                nombre: 'Caché Redis',
                terminoGlosario: 'Caché Redis',
                resumenUso: 'Mesa de entregas rápidas que alivia la base de datos en emergencias.',
                icono: 'cpu',
              },
              {
                nombre: 'Rate-limiting',
                terminoGlosario: 'Rate-limiting',
                resumenUso: 'Regulador de turnos para frenar recargas repetidas sin bloquear a la gente.',
                icono: 'shield',
              },
              {
                nombre: 'Logs',
                terminoGlosario: 'Logs',
                resumenUso: 'Registro de eventos para confirmar qué servicios están sanos (/api/health).',
                icono: 'terminal',
              },
            ],
          },
        ],
        diferenciacion: {
          cargosResumen:
            'Nombres de puesto para iniciar, como Junior Production Support / QA Engineer, Backend Developer Junior o Cloud Operations Analyst.',
          actividades: [
            'Ejecutar pruebas para detectar errores en funciones nuevas',
            'Revisar logs y gráficas en hora pico antes de actuar',
            'Confirmar que los datos reales se guarden sin pérdida',
          ],
          habilidades: [
            'Análisis con evidencias',
            'Lectura de logs',
            'Atención al detalle',
            'Calma bajo presión',
            'Pensamiento lógico',
            'Comunicación clara',
          ],
          problemasResumen:
            'Fallos reales del día a día separando lo que ve el usuario de la causa oculta, sin arriesgar datos.',
        },
        experienciaPractica: {
          tituloReto: 'Caída a las 8:00 a. m.',
          duracionEstimada: '20–30 minutos',
          disponible: true,
        },
      },
    ],
    timelinePasos: [
      {
        paso: 1,
        titulo: 'Paso 1: Primeros pasos y mirada de detective (0–2 años)',
        descripcion:
          'Al entrar al Nivel 1 aprendes cómo respira una aplicación con miles de personas reales: distinguir lo que reporta el usuario de la causa oculta, leer diarios de errores sin pánico y proteger los datos.',
      },
      {
        paso: 2,
        titulo: 'Paso 2: Más autonomía y prevención (3–6 años)',
        descripcion:
          'Ya no solo apagas incendios: diseñas pruebas para simular horas pico antes de lanzar cambios, optimizas bases de datos y cuidas que la nube no cueste más de lo necesario.',
      },
      {
        paso: 3,
        titulo: 'Paso 3: Liderazgo y arquitectura (7+ años)',
        descripcion:
          'Lideras equipos completos, diseñas cómo crecerá la plataforma para cientos de miles de usuarios y defines los estándares de calidad de toda la organización.',
      },
    ],
  },
  {
    id: 'ciencia-datos-producto',
    titulo: 'Ciencia de Datos / Analítica de Producto',
    area: 'Datos & Analítica',
    activa: false,
    duracionEstimada: '15–20 min',
    nivelEntrada: 'Nivel 1 · Junior Data Analyst',
    imagenPortada: '/src/assets/images/career_cloud_engineering_1795108986228.jpg',
    resumenCorto:
      'Convierte clics, encuestas y pruebas con usuarios en decisiones claras de producto usando estadística práctica y criterio ético sobre los datos.',
    acercaDe: {
      queTrata:
        'Descubre cómo los equipos de datos investigan por qué la gente deja de usar una app, prueban nuevas funciones con grupos pequeños y detectan números engañosos antes de tomar decisiones.',
      habilidadesClave: [
        'Seguir paso a paso dónde abandonan los usuarios dentro de una aplicación',
        'Verificar que los datos recogidos estén limpios y no falten registros',
        'Explicar hallazgos con gráficas sencillas a personas que no programan',
      ],
      requerimientos: [
        'Gusto por hacer preguntas con números y dudar de conclusiones apresuradas',
      ],
      actividadesGenerales: [
        'Revisar por qué bajó o subió una métrica en un tablero de producto',
        'Proponer pruebas pequeñas para confirmar si un cambio ayuda de verdad a los usuarios',
      ],
    },
    piramideProgresion: [],
    timelinePasos: [],
  },
  {
    id: 'ingenieria-industrial-operaciones',
    titulo: 'Ingeniería Industrial / Operaciones',
    area: 'Operaciones & Negocio',
    activa: false,
    duracionEstimada: '15–20 min',
    nivelEntrada: 'Nivel 1 · Junior Operations Analyst',
    imagenPortada: '/src/assets/images/career_cloud_engineering_1795108986228.jpg',
    resumenCorto:
      'Organiza envíos, tiempos de espera y recursos cuando llegan pedidos inesperados, cuidando entregas a tiempo y presupuesto.',
    acercaDe: {
      queTrata:
        'Analiza dónde se forman filas o retrasos en una bodega o servicio, ajusta turnos de trabajo y decide planes B cuando falla un proveedor importante.',
      habilidadesClave: [
        'Detectar el punto exacto donde se atora un proceso de principio a fin',
        'Cuidar el costo por pedido y el cumplimiento de entregas a tiempo',
        'Coordinar logística, control de calidad y servicio al cliente',
      ],
      requerimientos: [
        'Capacidad para ver cómo una decisión en un área afecta a todo el resto de la operación',
      ],
      actividadesGenerales: [
        'Investigar retrasos en entregas revisando tiempos de cada estación de trabajo',
        'Equilibrar personal, inventario y presupuesto sin bajar la calidad',
      ],
    },
    piramideProgresion: [],
    timelinePasos: [],
  },
];

export const RETOS: Reto[] = [
  {
    id: 'cs-caida-8am',
    carreraId: 'ingenieria-software-cloud',
    titulo: 'Caída a las 8:00 a.m.',
    empresaFicticia: 'EduCloud Live',
    empresaDescripcion:
      'Plataforma escolar de clases en vivo y asistencia donde 45,000 estudiantes se conectan cada mañana.',
    rolEstudiante: 'Analista Junior de Soporte y Calidad (tu primer rol en tecnología)',
    nivelPosicionamiento: 'Nivel 1 · Junior (0–2 años de experiencia)',
    // Pegar aquí a futuro el enlace de YouTube "No listado" (Unlisted), ej: "https://www.youtube.com/watch?v=..."
    videoUrl: '',
    metricasIniciales: {
      disponibilidad: 82,
      latenciaMs: 2400,
      presupuestoUsd: 1200,
      presupuestoLimiteUsd: 3000,
    },
    equipo: [
      {
        id: 'mateo',
        nombre: 'Mateo Silva',
        cargo: 'Líder Técnico (Tech Lead)',
        relacionConRol: 'Tu jefe directo: decide qué atender primero y aprueba cualquier cambio antes de aplicarlo.',
        avatarUrl: '/src/assets/images/avatar_mateo_silva_1795108986046.jpg',
        iniciales: 'MS',
        especialidad: 'Arquitectura y estabilidad',
      },
      {
        id: 'laura',
        nombre: 'Laura Méndez',
        cargo: 'Programadora del sistema (Backend)',
        relacionConRol: 'Escribe el código interno de la app y sabe qué cambio nuevo se publicó ayer.',
        avatarUrl: '/src/assets/images/avatar_laura_mendez_1795108985950.jpg',
        iniciales: 'LM',
        especialidad: 'Código del servidor y datos',
      },
      {
        id: 'carlos',
        nombre: 'Carlos Ruiz',
        cargo: 'Líder de Soporte a Estudiantes',
        relacionConRol: 'Recibe las quejas de colegios y profes cuando la app falla, y te cuenta qué ven en pantalla.',
        avatarUrl: '/src/assets/images/avatar_carlos_ruiz_1795108985764.jpg',
        iniciales: 'CR',
        especialidad: 'Atención a estudiantes y profes',
      },
      {
        id: 'sofia',
        nombre: 'Sofía Torres',
        cargo: 'Encargada de los Datos (DBA)',
        relacionConRol: 'Cuida el archivo central (PostgreSQL) para que no se llene de filas ni se pierda ninguna asistencia.',
        avatarUrl: '/src/assets/images/avatar_sofia_torres_1795108986268.jpg',
        iniciales: 'ST',
        especialidad: 'Archivo central de datos',
      },
    ],
    camposCarrera: [
      {
        nombre: 'Programación interna',
        foco: 'Mejorar funciones del sistema para que no trabajen doble',
        activoEnReto: true,
      },
      {
        nombre: 'Estabilidad y nube',
        foco: 'Mantener la app rápida, estable y sin gastar dinero de más',
        activoEnReto: true,
      },
      {
        nombre: 'Calidad y datos seguros',
        foco: 'Confirmar que ninguna solución borre o pierda asistencias reales',
        activoEnReto: true,
      },
      {
        nombre: 'Seguridad digital',
        foco: 'Distinguir una entrada masiva real de un ataque externo',
      },
      {
        nombre: 'Lectura de señales',
        foco: 'Cruzar gráficas de velocidad con el diario del servidor',
      },
    ],
    responsabilidadesRol: [
      'Buscar pistas reales antes de reiniciar nada a ciegas.',
      'Proteger las asistencias reales: nunca borrar ni arriesgar datos.',
      'Equilibrar dos metas juntas: que entren sin error (≥ 95 de cada 100) y cargue rápido (< 0.4 s).',
      'Explicar a tu líder un plan claro, ordenado y honesto con sus riesgos.',
    ],
    turnosReunion: [
      {
        id: 't1',
        minuto: '08:05 a.m.',
        duracionSegundos: 6,
        hablanteId: 'carlos',
        hablanteNombre: 'Carlos Ruiz',
        hablanteCargo: 'Líder de Soporte',
        mensaje:
          '¡Equipo, tenemos emergencia! Desde las 8:00 a.m. entraron más de 300 quejas de estudiantes y profes: al entrar a clase ven pantallas en blanco y errores HTTP 500.',
        datoClave: 'Qué pasa en pantalla: pantallas en blanco y errores HTTP 500 justo a las 08:00 a.m.',
      },
      {
        id: 't2',
        minuto: '08:06 a.m.',
        duracionSegundos: 6,
        hablanteId: 'laura',
        hablanteNombre: 'Laura Méndez',
        hablanteCargo: 'Programadora Backend',
        mensaje:
          'Ayer a las 6:00 p.m. publicamos la nueva funcionalidad "Historial de asistencia" en la pantalla de inicio. Sirve para marcar si el estudiante asistió o faltó a sus clases apenas abre la página. Cuando lo probamos con solo 10 cuentas funcionó rápido y sin fallos.',
        datoClave:
          'Cambio reciente: bloque "Historial de asistencia" al abrir el inicio (ver o marcar si asistió o faltó; probado solo con 10 cuentas).',
      },
      {
        id: 't3',
        minuto: '08:07 a.m.',
        duracionSegundos: 6,
        hablanteId: 'sofia',
        hablanteNombre: 'Sofía Torres',
        hablanteCargo: 'Encargada de Datos',
        mensaje:
          '¡Alerta en el archivo de datos! A las 08:00 en punto PostgreSQL subió al 98% y se llenaron las 100 ventanillas disponibles. Hay cientos de preguntas repetidas haciendo fila.',
        datoClave: 'Dónde está el atasco: archivo de datos al 98% con sus 100 ventanillas ocupadas.',
      },
      {
        id: 't4',
        minuto: '08:08 a.m.',
        duracionSegundos: 6,
        hablanteId: 'mateo',
        hablanteNombre: 'Mateo Silva',
        hablanteCargo: 'Líder Técnico',
        mensaje:
          'No apaguen los servidores porque sacarían de clase a quienes sí pudieron entrar. Quiero que tú investigues las señales, calmes la falla sin gastar de más y me entregues un plan seguro.',
        datoClave: 'Regla de Mateo: investiga con pruebas, no tumbes las clases ni quemen el presupuesto.',
      },
    ],
    cierreLider: {
      autor: 'Mateo Silva',
      cargo: 'Líder Técnico · EduCloud Live',
      problematica:
        'A las 08:00 a.m., cuando miles de estudiantes entran juntos a clase, la app pasó a tardar 2.4 segundos en cargar y casi 1 de cada 5 intentos falla.',
      tareaAsignada:
        'Ayuda a reparar la página para que los estudiantes puedan entrar a sus cursos con normalidad. Observa la gráfica y los 6 clics recientes del servidor para encontrar qué está causando la falla y hallar una solución.',
      explicacionMetricas:
        'Debes cuidar dos metas juntas: que al menos 95 de cada 100 estudiantes entren sin error y que el tiempo de respuesta sea menor a 0.4 s.',
    },
    telemetria: [
      { hora: '07:30', latenciaMs: 190, erroresHttp500Pct: 0.2, usuariosActivos: 3200 },
      { hora: '07:40', latenciaMs: 210, erroresHttp500Pct: 0.3, usuariosActivos: 5800 },
      { hora: '07:50', latenciaMs: 225, erroresHttp500Pct: 0.4, usuariosActivos: 9400 },
      {
        hora: '08:00',
        latenciaMs: 2400,
        erroresHttp500Pct: 18.4,
        usuariosActivos: 28500,
        esPicoCritico: true,
        nota: 'Entrada masiva a clases + nuevo Historial de asistencia',
      },
      { hora: '08:15', latenciaMs: 2280, erroresHttp500Pct: 16.9, usuariosActivos: 27400 },
      { hora: '08:30', latenciaMs: 2150, erroresHttp500Pct: 15.2, usuariosActivos: 26100 },
      { hora: '08:45', latenciaMs: 1980, erroresHttp500Pct: 13.8, usuariosActivos: 24900 },
      { hora: '09:00', latenciaMs: 1890, erroresHttp500Pct: 12.5, usuariosActivos: 23800 },
    ],
    logs: [
      {
        id: 'log-1',
        timestamp: '08:00:04.112Z',
        metodo: 'GET',
        endpoint: '/api/auth/session',
        status: 200,
        duracionMs: 42,
        subconsultasSql: 1,
        poolConexionesUso: '14/100',
        nivel: 'INFO',
        payloadResumen: 'Pide confirmar la cuenta del estudiante #44912 para dejarlo entrar (OK 200 · respondió bien).',
        trazaDetalle:
          'Qué hace: GET pide consultar quién inició sesión. Respondió OK 200 entregando los datos de la cuenta en solo 0.04 s (1 consulta rápida). El ingreso funciona bien.',
      },
      {
        id: 'log-2',
        timestamp: '08:00:09.408Z',
        metodo: 'GET',
        endpoint: '/api/clases/en-vivo',
        status: 200,
        duracionMs: 118,
        subconsultasSql: 2,
        poolConexionesUso: '38/100',
        nivel: 'INFO',
        payloadResumen: 'Pide el enlace y los datos de la clase en vivo de Cálculo I para mostrarlos en pantalla (OK 200 · respondió bien).',
        trazaDetalle:
          'Qué hace: GET consulta los datos de la videollamada. Respondió OK 200 en 0.12 s con solo 2 preguntas, muy por debajo del límite de 0.4 s.',
      },
      {
        id: 'log-3',
        timestamp: '08:00:12.875Z',
        metodo: 'GET',
        endpoint: '/api/asistencia/historial',
        status: 500,
        duracionMs: 1850,
        subconsultasSql: 420,
        poolConexionesUso: '100/100 (SATURADO)',
        nivel: 'ERROR',
        payloadResumen: 'Al abrir el inicio, la página pide los registros del bloque "Historial de asistencia" (donde se ve o marca si asistió o faltó a sus clases).',
        trazaDetalle:
          'Qué hace este pedido: al abrir el inicio, pide los registros del bloque "Historial de asistencia" (donde se ve o marca si el estudiante asistió o faltó a sus clases).\nQué está fallando : en vez de buscar de una sola vez la lista de estudiantes que asistieron a una clase, el sistema pregunta uno por uno si cada estudiante asistió o no, repitiendo consultas hasta hacer 420 en lugar de una sola. Con 10 cuentas casi ni se nota, pero con mucha gente a la vez tarda 1.85 s y da Error 500, este problema se llama (Query N+1).',
        sqlMuestra:
          '-- En vez de traer juntos de una vez los estudiantes que asistieron a una clase,\n-- hace 420 preguntas una por una (caso por caso o estudiante por estudiante):\nSELECT estudiante_id, estado FROM asistencia_registros WHERE sesion_id = $1; -- x 420 veces',
      },
      {
        id: 'log-4',
        timestamp: '08:00:14.021Z',
        metodo: 'POST',
        endpoint: '/api/reservas/asistencia',
        status: 500,
        duracionMs: 2410,
        subconsultasSql: 3,
        poolConexionesUso: '100/100 (FILA LLENA)',
        nivel: 'ERROR',
        payloadResumen: 'Envía una asistencia nueva para guardarla, pero dio Error 500 porque la fila estaba llena.',
        trazaDetalle:
          'Qué hace: POST envía una asistencia nueva para guardarla. Debía responder OK 200 confirmando el guardado, pero tardó 2.41 s y dio Error 500 (fallo interno) porque el historial ocupó todas las ventanillas.',
      },
      {
        id: 'log-5',
        timestamp: '08:00:18.540Z',
        metodo: 'GET',
        endpoint: '/api/asistencia/historial',
        status: 500,
        duracionMs: 2390,
        subconsultasSql: 420,
        poolConexionesUso: '100/100 (SATURADO)',
        nivel: 'ERROR',
        payloadResumen: 'Al fallar el bloque "Historial de asistencia", la página volvió a pedir esos datos sola y dio Error 500.',
        trazaDetalle:
          'Qué hace: GET vuelve a pedir los datos del bloque "Historial de asistencia" para mostrar si asistió o faltó. En vez de entregarlos en OK 200, lanzó otra vez 420 preguntas una por una (Query N+1), tardó 2.39 s y falló con Error 500.',
      },
      {
        id: 'log-6',
        timestamp: '08:00:22.104Z',
        metodo: 'GET',
        endpoint: '/api/health',
        status: 200,
        duracionMs: 9,
        subconsultasSql: 0,
        poolConexionesUso: 'N/A',
        nivel: 'INFO',
        payloadResumen: 'Pide revisar si los servidores están encendidos y con espacio libre (OK 200 · todo sano).',
        trazaDetalle:
          'Qué hace: GET consulta el estado básico del servidor. Respondió OK 200 en 0.01 s confirmando 62% de disco libre y buena red: NO falla el internet ni falta espacio en disco.',
      },
    ],
    herramientasReales: {
      grafana: {
        id: 'grafana',
        nombre: 'Grafana',
        categoria: 'Tablero visual de salud en vivo',
        queHaceEnEmpresa:
          'Funciona como el tablero de un carro: muestra en gráficas qué tan rápida va la app, cuántos errores salen y si el archivo de datos se está llenando.',
        relacionConCaso:
          'Deja ver el salto brusco a las 08:00 a.m.: la espera sube de 0.2 s a 2.4 s y los errores saltan al 18.4% justo al entrar a clases.',
        documentacionUrl: 'https://grafana.com/docs/grafana/latest/',
        documentacionLabel: 'Ver documentación oficial de Grafana',
        slides: [
          {
            titulo: 'Tiempo de carga vs. Meta saludable',
            subtitulo: 'Maquinaria principal · Mañana 07:30 - 09:00 a.m.',
            tipoVisual: 'grafana-latencia',
            leyenda: 'La meta es estar debajo de 0.4 s; a las 08:00 a.m. el tiempo se multiplica por 6.',
          },
          {
            titulo: 'Ventanillas ocupadas en el archivo de datos',
            subtitulo: 'Ventanillas en uso vs. fila de espera (Máximo: 100)',
            tipoVisual: 'grafana-pool',
            leyenda: 'A las 08:00 a.m. se ocupan las 100/100 ventanillas y cientos de clics quedan esperando.',
          },
        ],
      },
      datadog: {
        id: 'datadog',
        nombre: 'Datadog APM',
        categoria: 'Rayos X de cada clic dentro de la app',
        queHaceEnEmpresa:
          'Sigue el viaje completo de un clic paso a paso y señala exactamente en qué función interna se está perdiendo el tiempo.',
        relacionConCaso:
          'Demuestra que casi todo el retraso y los fallos ocurren al pedir el historial, mientras que entrar a la cuenta o abrir la videollamada sigue rápido.',
        documentacionUrl: 'https://docs.datadoghq.com/tracing/',
        documentacionLabel: 'Ver documentación oficial de Datadog APM',
        slides: [
          {
            titulo: 'En qué se gasta el tiempo de un clic',
            subtitulo: 'Abrir historial de asistencia · 1.85 s en total',
            tipoVisual: 'datadog-apm',
            leyenda: 'El 94% del tiempo (1.74 de 1.85 s) se pierde haciendo 420 preguntas una por una —caso por caso o estudiante por estudiante— en vez de traer de una vez los estudiantes que asistieron a una clase en una sola consulta (Query N+1).',
          },
          {
            titulo: 'Qué funciones provocan los errores',
            subtitulo: 'Comparación entre la tarjeta nueva y las funciones sanas',
            tipoVisual: 'datadog-errores',
            leyenda: 'Casi todos los fallos nacen en la tarjeta de historial lanzada la tarde anterior.',
          },
        ],
      },
      'postgres-slow-log': {
        id: 'postgres-slow-log',
        nombre: 'Registro de consultas lentas (PostgreSQL)',
        categoria: 'Cámara de vigilancia del archivo de datos',
        queHaceEnEmpresa:
          'Anota qué preguntas tardan demasiado o se repiten miles de veces por minuto para que el equipo pueda unirlas en una sola consulta rápida.',
        relacionConCaso:
          'Confirma que al cargar "Historial de asistencia", en vez de traer juntos de una sola vez los estudiantes que asistieron a una clase, el sistema lanza 420 preguntas seguidas una por una (Query N+1) y lleva el archivo al 98%.',
        documentacionUrl: 'https://www.postgresql.org/docs/current/runtime-config-logging.html',
        documentacionLabel: 'Ver documentación oficial de PostgreSQL',
        slides: [
          {
            titulo: 'Preguntas repetidas que llenan el archivo',
            subtitulo: 'Consultas más pesadas en los últimos 10 minutos',
            tipoVisual: 'postgres-slow',
            leyenda: 'Una sola pregunta repetida se lanzó más de 1.19 millones de veces en apenas 10 minutos.',
          },
          {
            titulo: 'Antes vs. Después de aliviar el archivo',
            subtitulo: '420 preguntas una por una vs. copia rápida + una sola consulta',
            tipoVisual: 'postgres-explain',
            leyenda: 'En emergencia se alivia con una copia rápida de 60 s; la solución definitiva es traer los datos juntos de una sola vez en una sola consulta (por ejemplo, los estudiantes que asistieron a una clase).',
          },
        ],
      },
    },
    nodos: [
      {
        id: 'nodo-1',
        numero: 1,
        titulo: 'Paso 1 · Descubrir qué causó la caída con pruebas reales',
        contextoPregunta:
          'Antes de cambiar nada: según la gráfica y los 6 clics recientes de arriba, ¿qué se atascó a las 08:00 a.m. y por qué?',
        pista:
          'El chequeo de pulso (/api/health) está sano (0.01 s, 62% libre). Mira el pedido GET /api/asistencia/historial: carga el bloque "Historial de asistencia" al abrir el inicio, pero en vez de traer de una vez los estudiantes que asistieron a una clase, hace 420 preguntas una por una (Query N+1), tarda 1.85 s y llena las 100/100 ventanillas.',
        opciones: [
          {
            id: 'n1-b',
            texto: 'Se cayó todo el internet de los colegios y de la nube.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -4, latenciaMs: 150 },
            impactoResumen: 'Entran sin error -4 de cada 100 · Tiempo +0.2 s',
            correoConsecuencia: {
              remitente: 'Mateo Silva',
              cargoRemitente: 'Líder Técnico',
              emailRemitente: 'mateo.silva@educloud.sim',
              asunto: 'Falsa pista — El internet sí funciona',
              cuerpo:
                'Revisé la red tras tu aviso: el chequeo /api/health responde rápido y las videollamadas sí abren. Llamar al proveedor de internet nos hizo perder 6 minutos mientras subían los fallos (-4 de cada 100 entran sin error, +0.2 s de espera). Mira cuántas ventanillas quedaron ocupadas (100/100) en los clics.',
              impactoEtiqueta: 'Entran sin error -4 de cada 100 · Tiempo +0.2 s',
            },
          },
          {
            id: 'n1-c',
            texto: 'Se llenó el disco duro donde se guardan los archivos de la página web.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -3, latenciaMs: 120 },
            impactoResumen: 'Entran sin error -3 de cada 100 · Tiempo +0.1 s',
            correoConsecuencia: {
              remitente: 'Laura Méndez',
              cargoRemitente: 'Programadora Backend',
              emailRemitente: 'laura.mendez@educloud.sim',
              asunto: 'El disco tiene 62% libre',
              cuerpo:
                '/api/health ya mostraba que sobraba el 62% del disco. Mientras revisábamos espacio innecesariamente, el problema siguió creciendo (-3 de cada 100 entran sin error, +0.1 s de espera). El atasco viene de las 420 preguntas repetidas al archivo central.',
              impactoEtiqueta: 'Entran sin error -3 de cada 100 · Tiempo +0.1 s',
            },
          },
          {
            id: 'n1-a',
            texto:
              'Se llenaron las 100 ventanillas del archivo de datos (Connection Pool) porque al abrir el "Historial de asistencia", el sistema hace 420 preguntas una por una en vez de traer los datos juntos en una sola consulta (Query N+1).',
            esCorrecta: true,
            explicacionCorrecta:
              '¡Exacto! Conectaste el salto de las 08:00 a.m. con GET /api/asistencia/historial: al abrir el inicio, en vez de traer de una vez los estudiantes que asistieron a una clase en una sola consulta, hace 420 preguntas una por una (Query N+1). Con 10 cuentas parecía ir bien, pero con muchos usuarios a la vez sube a 1.85 s, llena las 100 ventanillas y da Error 500.',
          },
          {
            id: 'n1-d',
            texto: 'Es un ataque externo de hackers para tumbar la plataforma.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -6, latenciaMs: 180 },
            impactoResumen: 'Entran sin error -6 de cada 100 · Tiempo +0.2 s',
            correoConsecuencia: {
              remitente: 'Carlos Ruiz',
              cargoRemitente: 'Líder de Soporte',
              emailRemitente: 'carlos.ruiz@educloud.sim',
              asunto: 'URGENTE: El bloqueo dejó fuera a colegios reales',
              cuerpo:
                'Al activar bloqueos pensando en un ataque, terminamos bloqueando a estudiantes reales entrando desde sus casas a las 08:00 a.m. (-6 de cada 100 entran sin error, +0.2 s de espera). No son hackers: es nuestra propia entrada a clases disparando la tarjeta nueva.',
              impactoEtiqueta: 'Entran sin error -6 de cada 100 · Tiempo +0.2 s',
            },
          },
        ],
      },
      {
        id: 'nodo-2',
        numero: 2,
        titulo: 'Paso 2 · Frenar la caída sin desconectar las clases',
        contextoPregunta:
          'Ya sabes qué llena el archivo de datos. Mateo pide calmar la falla en 10 minutos sin sacar a nadie que ya esté en clase. ¿Qué haces primero?',
        pista:
          'Si 200 estudiantes piden ver el mismo historial pasado, en vez de buscar cada carpeta en el archivo central, puedes dejar una copia rápida por 60 segundos (Caché Redis) y frenar recargas seguidas.',
        opciones: [
          {
            id: 'n2-b',
            texto: 'Apagar y reiniciar todos los servidores ahora mismo para "limpiar" el sistema.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -15, latenciaMs: 300 },
            impactoResumen: 'Entran sin error -15 de cada 100 · Tiempo +0.3 s',
            correoConsecuencia: {
              remitente: 'Carlos Ruiz',
              cargoRemitente: 'Líder de Soporte',
              emailRemitente: 'carlos.ruiz@educloud.sim',
              asunto: 'EMERGENCIA: Sacaste de clase a 8,000 estudiantes',
              cuerpo:
                'Reiniciar todo desconectó las clases en vivo de quienes sí habían logrado entrar. Al volver a encender, todos entraron juntos y volvieron a llenar PostgreSQL (-15 de cada 100 entran sin error, +0.3 s de espera).',
              impactoEtiqueta: 'Entran sin error -15 de cada 100 · Tiempo +0.3 s',
            },
          },
          {
            id: 'n2-a',
            texto:
              'Activar una copia rápida por 60 segundos (Caché Redis) para leer el historial y poner un límite suave de recargas (Rate-limiting).',
            esCorrecta: true,
            explicacionCorrecta:
              '¡Buena jugada! Al entregar el historial desde la copia rápida por 60 segundos y frenar recargas seguidas, suben +10 de cada 100 estudiantes que entran sin error y la espera baja -1.7 s sin sacar a nadie de clase.',
            impactoMetricas: { disponibilidad: 10, latenciaMs: -1650 },
          },
          {
            id: 'n2-d',
            texto: 'Sumar 10 servidores web nuevos de emergencia sin tocar el historial.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -4, latenciaMs: 120 },
            impactoResumen: 'Entran sin error -4 de cada 100 · Tiempo +0.1 s',
            correoConsecuencia: {
              remitente: 'Mateo Silva',
              cargoRemitente: 'Líder Técnico',
              emailRemitente: 'mateo.silva@educloud.sim',
              asunto: 'El archivo de datos sigue al 98%',
              cuerpo:
                'Poner más meseros (servidores web) no sirve si la cocina (PostgreSQL) sigue atorada con 420 preguntas por pedido. Ahora hay aún más tráfico empujando el mismo atasco (-4 de cada 100 entran sin error, +0.1 s de espera).',
              impactoEtiqueta: 'Entran sin error -4 de cada 100 · Tiempo +0.1 s',
            },
          },
          {
            id: 'n2-c',
            texto: 'Borrar los historiales pasados de la base de datos para dejarla más liviana.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -10, latenciaMs: 250 },
            impactoResumen: 'Entran sin error -10 de cada 100 · Tiempo +0.3 s',
            correoConsecuencia: {
              remitente: 'Sofía Torres',
              cargoRemitente: 'Encargada de Datos',
              emailRemitente: 'sofia.torres@educloud.sim',
              asunto: 'ALERTA: Frené un borrado de datos reales',
              cuerpo:
                'Detuve tu acción antes de que borrara las asistencias pasadas de los estudiantes. Perder datos reales de personas es inaceptable y la fila siguió bloqueada (-10 de cada 100 entran sin error, +0.3 s de espera).',
              impactoEtiqueta: 'Entran sin error -10 de cada 100 · Tiempo +0.3 s',
            },
          },
        ],
      },
      {
        id: 'nodo-3',
        numero: 3,
        titulo: 'Paso 3 · Confirmar que todo quedó bien antes de cerrar',
        contextoPregunta:
          'La copia rápida ya alivió la fila. ¿Cómo compruebas que las clases y las asistencias de hoy funcionan bien de verdad antes de cerrar la emergencia?',
        pista:
          'Que a ti te abra la portada no prueba que 28,500 estudiantes puedan guardar su asistencia de hoy. Revisa las métricas reales, confirma que las asistencias nuevas (POST) sí se guarden y coordina el arreglo definitivo con Laura.',
        opciones: [
          {
            id: 'n3-b',
            texto:
              'Dar el problema por cerrado en cuanto la página abra en tu propio computador y apagar las alertas.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -8, latenciaMs: 220 },
            impactoResumen: 'Entran sin error -8 de cada 100 · Tiempo +0.2 s',
            correoConsecuencia: {
              remitente: 'Sofía Torres',
              cargoRemitente: 'Encargada de Datos',
              emailRemitente: 'sofia.torres@educloud.sim',
              asunto: 'Cuidado: a ti te abrió, pero las asistencias no se están guardando',
              cuerpo:
                'Que la portada abra en tu pantalla no confirma que el botón "Marcar asistencia" esté guardando datos reales. Sin comprobar cuántos entran sin error ni el guardado, el problema volvió a subir (-8 de cada 100 entran sin error, +0.2 s de espera).',
              impactoEtiqueta: 'Entran sin error -8 de cada 100 · Tiempo +0.2 s',
            },
          },
          {
            id: 'n3-c',
            texto:
              'Guardar también en la copia rápida temporal las asistencias nuevas (POST) sin llevarlas al archivo central.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -7, latenciaMs: 180 },
            impactoResumen: 'Entran sin error -7 de cada 100 · Tiempo +0.2 s',
            correoConsecuencia: {
              remitente: 'Laura Méndez',
              cargoRemitente: 'Programadora Backend',
              emailRemitente: 'laura.mendez@educloud.sim',
              asunto: 'ERROR DE DATOS: Se perdieron asistencias de hoy',
              cuerpo:
                'Si guardamos una asistencia nueva solo en la copia temporal sin escribirla en PostgreSQL, al estudiante le sale "Guardado" pero el dato se pierde al vencer los 60 segundos (-7 de cada 100 entran sin error, +0.2 s de espera). La copia rápida solo sirve para leer historiales (GET).',
              impactoEtiqueta: 'Entran sin error -7 de cada 100 · Tiempo +0.2 s',
            },
          },
          {
            id: 'n3-d',
            texto:
              'Dejar ese parche temporal para siempre y decirle al equipo que no toque el código del historial.',
            esCorrecta: false,
            impactoMetricas: { disponibilidad: -5, latenciaMs: 140 },
            impactoResumen: 'Entran sin error -5 de cada 100 · Tiempo +0.1 s',
            correoConsecuencia: {
              remitente: 'Mateo Silva',
              cargoRemitente: 'Líder Técnico',
              emailRemitente: 'mateo.silva@educloud.sim',
              asunto: 'La copia rápida calma el golpe, pero no arregla el código',
              cuerpo:
                'Si dejamos las 420 preguntas repetidas sin corregir, en los próximos exámenes volveremos a saturar el archivo cada 60 segundos (-5 de cada 100 entran sin error, +0.1 s de espera). Hay que arreglar el código después de probarlo.',
              impactoEtiqueta: 'Entran sin error -5 de cada 100 · Tiempo +0.1 s',
            },
          },
          {
            id: 'n3-a',
            texto:
              'Confirmar que entren sin error al menos 95 de cada 100 estudiantes y el tiempo baje de 0.4 s, probar que las asistencias nuevas (POST) sí se guarden en PostgreSQL y coordinar con Laura el arreglo del código.',
            esCorrecta: true,
            explicacionCorrecta:
              '¡Cierre seguro! Subieron +5 de cada 100 estudiantes que entran sin error y la espera bajó -0.4 s hasta quedar por debajo de 0.4 s. Confirmaste que las asistencias nuevas sí quedan guardadas y dejaste en marcha la solución definitiva.',
            impactoMetricas: { disponibilidad: 5, latenciaMs: -430 },
          },
        ],
      },
    ],
    opcionesOrdenPrioridad: [
      {
        id: 'orden-refactor-primero',
        etiqueta:
          '1. Cambiar el código en vivo sin copia rápida previa → 2. Reiniciar todos los servidores → 3. Mirar las gráficas mañana',
        secuencia: [
          'Cambiar código en vivo',
          'Reiniciar servidores',
          'Mirar gráficas mañana',
        ],
        esOptimo: false,
      },
      {
        id: 'orden-optimo',
        etiqueta:
          '1. Aliviar la fila con copia rápida temporal (solo lectura) y límite de recargas → 2. Confirmar que casi todos entren sin error (≥95 de cada 100) y se guarden asistencias nuevas → 3. Corregir las 420 preguntas en el código tras probarlo con muchos usuarios',
        secuencia: [
          'Aliviar fila con copia rápida y límite de recargas',
          'Confirmar métricas y guardado real de asistencias',
          'Corregir código tras simulacro con carga',
        ],
        esOptimo: true,
      },
      {
        id: 'orden-escalado-primero',
        etiqueta:
          '1. Comprar 10 servidores extra → 2. Apagar todo el sistema de asistencia → 3. Revisar las pistas después',
        secuencia: [
          'Comprar 10 servidores extra',
          'Apagar el sistema completo',
          'Revisar pistas después',
        ],
        esOptimo: false,
      },
    ],
    opcionesTradeOff: [
      {
        id: 'tradeoff-presupuesto',
        etiqueta:
          'Pagar el doble cada mes en servidores extra para no tener que arreglar el código lento del historial.',
        esOptimo: false,
      },
      {
        id: 'tradeoff-datos',
        etiqueta:
          'Dejar de guardar asistencias en vivo en el archivo central para que la pantalla abra rápido.',
        esOptimo: false,
      },
      {
        id: 'tradeoff-optimo',
        etiqueta:
          'Aceptar que el historial pasado tarde hasta 60 segundos en reflejar cambios nuevos a cambio de estabilizar las clases de inmediato sin gastar de más.',
        esOptimo: true,
      },
    ],
    perfilProfesionalDefinido:
      "Eres un especialista senior en confiabilidad de plataformas educativas con 8 años de experiencia. Tu papel en esta simulación es dar retroalimentación amable, clara y realista a un estudiante de 16 años (10.º u 11.º grado) sin experiencia previa en programación tras vivir el caso 'Caída a las 8:00 a.m.' en EduCloud Live.\nJuzgas lo que importa de verdad en una empresa: que no reinicie servidores a ciegas en hora pico, que nunca arriesgue ni borre datos reales de estudiantes, y que cuide juntas las tres metas (que entren a clase, que cargue rápido y que no gaste presupuesto de más).\nAspectos clave a revisar:\n1. Diagnóstico con pruebas reales: debe unir dos pistas visibles (a las 08:00 a.m. la app pasó a tardar 2.4 segundos con 18.4% de fallos y la función de historial hace 420 preguntas repetidas que llenan las 100 ventanillas de PostgreSQL).\n2. Orden seguro bajo presión: primero calmar el atasco sin desconectar clases (copia rápida temporal de 60s para leer + límite de recargas), luego confirmar que las asistencias nuevas sí se guarden y después corregir el código.\n3. Sacrificio consciente y cuidado de datos: entender qué cede (que el historial pasado tarde hasta 60 segundos en actualizarse) y proteger los datos nuevos (no meterlos solo en copia temporal).\n4. Límites de la IA automática: notar dónde puede fallar una alerta automática (confundir la entrada normal de miles de estudiantes a las 8:00 a.m. con un ataque y bloquear gente real).\nREGLA ESTRICTA DE FIDELIDAD Y LENGUAJE: Evalúa únicamente lo que el estudiante eligió y escribió. Si algo faltó o quedó incompleto, dilo con respeto y claridad sin inventar respuestas. Usa español cotidiano, frases cortas y comparaciones simples de la vida diaria; evita tecnicismos sin explicar.",
    solucionReferenciaProfesional:
      "QUÉ CAUSÓ LA FALLA:\nEl archivo central de datos (PostgreSQL) se quedó sin ventanillas libres por culpa del nuevo bloque de 'Historial de asistencia' lanzado el día anterior. Esto se confirma con dos pruebas claras: (1) a las 08:00 a.m., cuando entran miles de estudiantes, el tiempo de carga salta a 2.4 segundos y casi 1 de cada 5 clics falla; y (2) al abrir el inicio para pedir ese historial, en vez de traer de una vez los estudiantes que asistieron a una clase, el sistema lanza 420 preguntas una por una (1.85 s y Error 500).\n\nPLAN DE ACCIÓN EN ORDEN:\n1. Calmar la caída sin apagar las clases: activar una copia rápida temporal de 60 segundos solo para mostrar historiales pasados y limitar recargas seguidas, liberando el archivo central al instante.\n2. Comprobar que todo quedó sano: revisar que los fallos bajen de 1%, que cargue en menos de 0.4 s y probar que las asistencias nuevas en vivo sí se guarden en PostgreSQL.\n3. Arreglo definitivo: coordinar con Laura para traer esos datos juntos de una sola vez en una sola consulta (por ejemplo, obtener de una vez los estudiantes que asistieron a una clase) y probarlo antes con miles de usuarios simulados.\n\nSACRIFICIO ACEPTADO, CUIDADO DE DATOS Y LÍMITES DE LA IA:\n- Sacrificio consciente: aceptar que el historial pasado tarde hasta 60 segundos en mostrar cambios nuevos para salvar todas las clases en vivo sin comprar servidores caros.\n- Cuidado de datos: usar la copia rápida únicamente para leer historiales pasados, nunca para guardar asistencias nuevas (si no, se perderían).\n- Límite de la IA: un sistema automático podría confundir la entrada masiva de estudiantes a las 8:00 a.m. con un ataque hacker y bloquear a personas reales.",
  },
];
