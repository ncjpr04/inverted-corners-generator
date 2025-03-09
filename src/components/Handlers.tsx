interface Props {
  cornerRadius: CornerRadius;
  setup: Setup;
}

const Handlers = ({ cornerRadius, setup }: Props) => {
  return (
    <>
      <circle
        cx={cornerRadius.tl}
        cy={cornerRadius.tl}
        r="1"
        stroke="gray"
        fill="none"
      />
      <circle
        cx={setup.width - cornerRadius.tr}
        cy={cornerRadius.tr}
        r="1"
        stroke="gray"
        fill="none"
      />
      <circle
        cx={setup.width - cornerRadius.br}
        cy={setup.height - cornerRadius.br}
        r="1"
        stroke="gray"
        fill="none"
      />
      <circle
        cx={cornerRadius.bl}
        cy={setup.height - cornerRadius.bl}
        r="1"
        stroke="gray"
        fill="none"
      />
    </>
  );
};

export default Handlers;
