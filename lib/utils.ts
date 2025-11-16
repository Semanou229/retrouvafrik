/**
 * Extrait le prénom de l'utilisateur depuis son nom complet ou son email
 */
export function getFirstName(user: any): string {
  // Essayer d'abord le nom complet depuis les métadonnées
  const fullName = user?.user_metadata?.full_name?.trim()
  if (fullName) {
    // Prendre le premier mot comme prénom
    const firstName = fullName.split(' ')[0]
    // Capitaliser la première lettre
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }

  // Sinon, extraire depuis l'email
  const email = user?.email || ''
  if (email) {
    const emailPart = email.split('@')[0]
    // Enlever les points et underscores, prendre la première partie
    const firstName = emailPart.split(/[._-]/)[0]
    // Capitaliser la première lettre
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }

  return 'Cher utilisateur'
}

/**
 * Génère un message de salutation selon l'heure de la journée
 */
export function getGreetingMessage(firstName: string): string {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    // Matin (5h - 12h)
    const messages = [
      `Bonjour ${firstName} ! ☀️ Une nouvelle journée commence, prête à aider la communauté ?`,
      `Bon matin ${firstName} ! 🌅 Espérons que cette journée apporte de bonnes nouvelles.`,
      `Salut ${firstName} ! ☀️ C'est le moment idéal pour vérifier vos annonces.`,
      `Bonjour ${firstName} ! 🌞 Que cette matinée soit remplie d'espoir et de retrouvailles.`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  } else if (hour >= 12 && hour < 18) {
    // Après-midi (12h - 18h)
    const messages = [
      `Bon après-midi ${firstName} ! 🌤️ Comment se passe votre journée ?`,
      `Salut ${firstName} ! ☀️ L'après-midi est un bon moment pour partager des informations.`,
      `Bonjour ${firstName} ! 🌞 Espérons que votre journée se passe bien.`,
      `Salut ${firstName} ! 🌤️ N'oubliez pas de vérifier vos messages et annonces.`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  } else if (hour >= 18 && hour < 22) {
    // Soirée (18h - 22h)
    const messages = [
      `Bonsoir ${firstName} ! 🌆 Une belle soirée pour faire le point sur vos annonces.`,
      `Bonsoir ${firstName} ! 🌅 Espérons que cette journée a été productive.`,
      `Salut ${firstName} ! 🌆 Le soir est souvent un moment où les gens sont plus actifs.`,
      `Bonsoir ${firstName} ! 🌇 Prenez le temps de vérifier les nouvelles informations.`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  } else {
    // Nuit (22h - 5h)
    const messages = [
      `Bonne nuit ${firstName} ! 🌙 Reposez-vous bien, la communauté continue de veiller.`,
      `Bonsoir ${firstName} ! 🌙 Il est tard, mais la solidarité ne dort jamais.`,
      `Bonne soirée ${firstName} ! 🌙 N'oubliez pas de vérifier vos annonces demain.`,
      `Salut ${firstName} ! 🌙 Il est temps de se reposer, à demain !`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
}

