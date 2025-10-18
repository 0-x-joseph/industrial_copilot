{
  description = "Dash Minimal Python Project with Virtual Environment (Nix Flake)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs supportedSystems (system: f system);
    in {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = pkgs.python311; # Change to python310, python312, etc. as needed
        in {
          default = pkgs.mkShell {
            name = "dash-minimal-dev-shell";
            buildInputs = [
              (python.withPackages (ps: with ps; [
                dash		# Dash web framework
                plotly		# Plotly for graphing
                pandas		# Data handling
                uvicorn		#Development server
				jinja2		#Template engine
				httpx		# HTTP requests for web APIs
                flake8		# Linting
                black		# Formatting
                pytest		# Testing
				]))
				pkgs.python311Packages.pip
            ];
            # Optionally, set environment variables here
            # PYTHONPATH = ./.;
          };
        }
      );
    };
}
