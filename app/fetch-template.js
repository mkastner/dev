export default async function fetchTemplate(url) {
  try {
    const response = await fetch(url);
    const template = await response.text();
    const splittedTemplate = template.split('[CONTENT]');
    return (req, res, next) => {
      res.locals.template = {
        top: splittedTemplate[0],
        bottom: splittedTemplate[1],
      };
      return next();
    };
  } catch (error) {
    console.error('Error fetching template:', error);
  }
};
