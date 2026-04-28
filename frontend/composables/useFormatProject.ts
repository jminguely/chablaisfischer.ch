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
    const title = project.title || "";
    const lieu = sidebar?.lieu && sidebar.lieu !== "—" ? sidebar.lieu : "";
    const annee = sidebar?.annee && sidebar.annee !== "—" ? sidebar.annee : "";
    const statut =
      sidebar?.statut && sidebar.statut !== "—" ? sidebar.statut : "";

    let result = title;
    if (lieu) result = result ? `${result} ${lieu}` : lieu;

    const suffixParts = [annee, statut].filter(Boolean);
    if (suffixParts.length > 0)
      result += `${result ? ", " : ""}${suffixParts.join(", ")}`;

    return result;
  };

  return { formatProjectTitle };
};
