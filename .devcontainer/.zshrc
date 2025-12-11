export PS1='%F{blue}%~ %(?.%F{green}.%F{red})%#%f '

if [[ -e ~/.config/dotfiles/zsh/zshrc ]]; then
  source ~/.config/dotfiles/zsh/zshrc
fi

export EDITOR="code -w"
