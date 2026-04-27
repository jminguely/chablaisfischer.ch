export const useFormatProject = () => {
  const formatProjectTitle = (project: {
    title?: string;
    fieldsProjectSidebar?: {
      lieu?: string | null;
      statut?: string | null;
      annee?: string | null;
    } | null;
  }) => {
    const sidebar = project.fieldsProjectSidebar;
    let result = project.title || "";
    if (sidebar?.lieu && sidebar.lieu !== "—") result += `, ${sidebar.lieu}`;
    if (sidebar?.statut && sidebar.statut !== "—")
      result += ` \u2013 ${sidebar.statut}`;
    if (sidebar?.annee && sidebar.annee !== "—")
      result += ` \u2013 ${sidebar.annee}`;
    return result;
  };

  return { formatProjectTitle };
};
