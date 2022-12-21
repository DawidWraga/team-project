export const processPrismaProps = (prismaProps: any, operation: string) => {
  // pattern:
  // 1. operation check
  // 2. guard clause
  // 3. process logic

  if (operation.includes('create')) {
    if (prismaProps.data) return prismaProps;

    return { data: prismaProps };
  }

  if (operation.includes('find')) {
    if (prismaProps.where) return prismaProps;

    return { where: prismaProps };
  }

  if (operation.includes('delete')) {
    if (prismaProps.where) return prismaProps;

    return { where: prismaProps };
  }

  if (operation.includes('update')) {
    if (prismaProps.where || prismaProps.data) return prismaProps;

    const { id, ...rest } = prismaProps;
    prismaProps = { where: { id }, data: { ...rest } };
  }
};
