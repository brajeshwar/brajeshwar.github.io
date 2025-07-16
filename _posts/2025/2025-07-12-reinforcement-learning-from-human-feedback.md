# Reinforcement Learning from Human Feedback (RLHF)

[Reinforcement Learning from Human Feedback](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback) (RLHF) is an approach to align AI with human values, preferences, and ethical considerations. RLHF trains AI models by learning from human guidance, judgment, and feedback. RLHF has become increasingly critical with the advancement of [Large Language Models](https://en.wikipedia.org/wiki/Large_language_model) (LLMs), such as [ChatGPT](https://chatgpt.com) and [Claude](https://claude.ai/), and other AI systems that must interact with humans.

We can’t easily program the “right” behavior but can recognize it when we see it. It’s like teaching a pet or child through guidance and encouragement rather than strict instructions. An AI may give correct answers, but most standard humans will know the right answer, not just the correct ones.

RLHF is an integration of reinforcement and supervised learning. First, a base model is trained using traditional supervised learning on a large corpus of data. Then, human labelers are enlisted to rank outputs or provide preferences on generated responses. These preferences are used to train a reward model, which estimates the desirability of outputs. The final step involves using reinforcement learning algorithms, like Proximal Policy Optimization (PPO),[^PPO] to fine-tune the model so that it produces outputs aligned with human expectations.

## Compliance and Governance

I got into reading more about RLHF from a compliance and governance perspective. AI models trained with RLHF must comply with various regulatory frameworks, including the [General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) (GDPR) in the European Union, as well as emerging AI governance acts, such as the [EU AI Act](https://en.wikipedia.org/wiki/Artificial_Intelligence_Act).

Human annotators often review sensitive data, raising questions about data minimization, consent, and secure handling. Moreover, RLHF raises issues of auditability: How do organizations ensure that the training data and human feedback used to fine-tune models meet compliance standards?

Transparency becomes a critical requirement. AI developers must maintain detailed logs of feedback data, training processes, and updates to the reward model to support future audits and strengthen accountability.

The EU AI Act, formally adopted in 2024, introduces a tiered risk-based classification for AI systems, with “high-risk” applications subjected to strict obligations on data governance, human oversight, robustness, and transparency. Systems involved in decision-making, safety-critical tasks, or producing content at scale are particularly scrutinized.

RLHF plays a crucial role in ensuring that high-risk AI models remain controllable, interpretable, and adaptable to human values, aligning with the Act’s emphasis on human-centric AI. Furthermore, the law mandates that AI systems incorporate mechanisms for traceability and post-deployment monitoring.

RLHF supports this through its feedback logging and reward modeling pipeline, providing a structured method for continuous refinement and human-in-the-loop auditing.

## Humans

On the one hand, RLHF enables AI to learn behaviors that align with socially accepted norms, ethical standards, and inclusive values. For example, by having human annotators guide a model away from producing harmful, biased, or toxic content, RLHF acts as a safeguard against misuse and marginalization.

On the other hand, this process is only as humane as the labor that supports it. Human feedback is often outsourced to large-scale annotation workforces, some of whom work under opaque conditions, inconsistent compensation, and minimal psychological safeguards.

Moreover, the human values RLHF aims to capture are neither universal nor static. The feedback received is shaped by cultural context, annotator demographics, and social biases. This introduces a profound philosophical question: Whose values are we encoding into these models?

{:.aside .right}
“With great power comes great responsibility.” — Uncle Ben, Spiderman

The alignment problem thus becomes a socio-technical issue. There is ongoing research into diversifying feedback sources, incorporating adversarial feedback, and developing models that can express uncertainty or defer to human judgment when necessary.

In the long term, RLHF represents a crucial step toward making AI systems safe, reliable, and aligned with human values. But as with any powerful tool, it must be wielded with responsibility, oversight, and compassion. The technical advancements in reward modeling and policy optimization must be matched with robust compliance frameworks and a commitment to humane labor practices. Only then can we ensure that AI reflects not only our intelligence but also our collective humanity.

### Further Reading

- [Illustrating Reinforcement Learning from Human Feedback (RLHF)](https://huggingface.co/blog/rlhf)
- [Constitutional AI: Harmlessness from AI Feedback](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)

[^PPO]: [Proximal Policy Optimization](https://en.wikipedia.org/wiki/Proximal_policy_optimization) (PPO) is a type of algorithm used in reinforcement learning to help an AI learn how to make good decisions through trial and error. It improves the AI’s behavior (or policy) step by step while making sure each update isn’t too big—like taking careful baby steps instead of giant risky leaps. This prevents the learning from going off-track and helps the AI gradually get better at tasks, like playing games or walking in a simulation.